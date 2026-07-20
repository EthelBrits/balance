import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FactCard } from './FactCard';

describe('FactCard', () => {
  it('toont het kaartje "Even weten" met een weetje', () => {
    render(<FactCard />);
    expect(screen.getByText('Even weten')).toBeInTheDocument();
  });

  it('toont een ander weetje na doorklikken', async () => {
    const { container } = render(<FactCard />);
    const first = container.textContent;
    await userEvent.click(screen.getByLabelText('Toon een volgend weetje'));
    const second = container.textContent;
    expect(first).not.toBe(second);
  });
});
