import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('toont de waarde en verhoogt bij klikken', async () => {
    const onChange = vi.fn();
    render(<Counter label="Glazen" value={3} onChange={onChange} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Glazen verhogen'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('verlaagt niet onder het minimum', () => {
    const onChange = vi.fn();
    render(<Counter label="Glazen" value={0} min={0} onChange={onChange} />);
    expect(screen.getByLabelText('Glazen verlagen')).toBeDisabled();
  });
});
