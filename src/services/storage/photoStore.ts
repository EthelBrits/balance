import { get, set, del, keys, createStore, type UseStore } from 'idb-keyval';

/**
 * Aparte opslaglaag voor lichaamsfoto's, volledig gescheiden van de rest.
 * Reden: localStorage heeft een quotum van ±5 MB; één foto vult dat al.
 * Foto's staan daarom in IndexedDB en zijn nooit onderdeel van de automatische export.
 */
const photoDb: UseStore = createStore('mijn-balans-photos', 'photos');

export type ProgressPhoto = {
  id: string;
  date: string;
  /** Data-URL van de afbeelding, uitsluitend lokaal bewaard. */
  dataUrl: string;
  note?: string;
};

export async function savePhoto(photo: ProgressPhoto): Promise<void> {
  await set(photo.id, photo, photoDb);
}

export async function getPhoto(id: string): Promise<ProgressPhoto | undefined> {
  return get<ProgressPhoto>(id, photoDb);
}

export async function getAllPhotos(): Promise<ProgressPhoto[]> {
  const allKeys = await keys(photoDb);
  const photos = await Promise.all(allKeys.map((k) => get<ProgressPhoto>(k as string, photoDb)));
  return photos
    .filter((p): p is ProgressPhoto => Boolean(p))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function deletePhoto(id: string): Promise<void> {
  await del(id, photoDb);
}

export async function clearPhotos(): Promise<void> {
  const allKeys = await keys(photoDb);
  await Promise.all(allKeys.map((k) => del(k as string, photoDb)));
}
