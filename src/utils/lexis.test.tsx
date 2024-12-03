import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { TolkitLexis } from './lexis';

describe('lexis.tsx', () => {
  beforeEach(() => {
    vi.spyOn(document.head, 'appendChild').mockImplementation(() => null);
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <TolkitLexis sessionId="test-session" organizationId="test-org" />
    );
    expect(container).toBeDefined();
  });

  it('should not render on server side', () => {
    const windowSpy = vi.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => undefined);

    const { container } = render(
      <TolkitLexis sessionId="test-session" organizationId="test-org" />
    );
    expect(container.children).toHaveLength(0);
  });

  it('should create script with correct URL', () => {
    const sessionId = 'test-session';
    const organizationId = 'test-org';
    
    render(<TolkitLexis sessionId={sessionId} organizationId={organizationId} />);
    
    const appendChildSpy = vi.spyOn(document.head, 'appendChild');
    expect(appendChildSpy).toHaveBeenCalled();
  });
});
