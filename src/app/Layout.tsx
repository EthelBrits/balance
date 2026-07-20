import { NavLink, Outlet } from 'react-router-dom';
import { NAV_ITEMS } from './navigation';
import { Logo } from '../components/Logo';

/** App-shell: zijbalk op desktop, bottom-navigatie op mobiel. */
export function Layout() {
  return (
    <div className="min-h-screen bg-bg md:flex">
      {/* Zijbalk — desktop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sand bg-surface/70 p-5 md:flex">
        <Logo withSubtitle className="mb-8" />
        <nav aria-label="Hoofdnavigatie" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 font-heading font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-text-muted hover:bg-sand hover:text-text'
                }`
              }
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto pt-6 text-xs text-text-muted">
          Ontwikkeld door huisarts Dr. Ethel Brits.
        </p>
      </aside>

      {/* Inhoud */}
      <div className="flex min-h-screen w-full flex-col">
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10">
          <Outlet />
        </main>

        {/* Bottom-navigatie — mobiel */}
        <nav
          aria-label="Hoofdnavigatie"
          className="fixed inset-x-0 bottom-0 z-20 border-t border-sand bg-surface/95 backdrop-blur md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <ul className="mx-auto flex max-w-2xl items-stretch justify-around">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `tap-target flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                      isActive ? 'text-primary-dark' : 'text-text-muted'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className="h-6 w-6"
                        strokeWidth={isActive ? 2.4 : 1.8}
                        aria-hidden="true"
                      />
                      <span className="font-heading font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
