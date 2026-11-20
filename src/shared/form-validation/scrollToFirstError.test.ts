import { afterEach, describe, expect, it, vi } from 'vitest';
import { scrollToFirstError } from '@/shared/form-validation/scrollToFirstError';

describe('scrollToFirstError', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('scrolls and focuses the first matching field by id', () => {
    const first = document.createElement('input');
    first.id = 'field-a';
    first.focus = vi.fn();
    first.scrollIntoView = vi.fn();
    const second = document.createElement('input');
    second.id = 'field-b';
    second.focus = vi.fn();
    second.scrollIntoView = vi.fn();
    document.body.append(first, second);

    scrollToFirstError(['field-a', 'field-b']);

    expect(first.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });
    expect(first.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(second.scrollIntoView).not.toHaveBeenCalled();
  });

  it('skips missing fields and uses the next id', () => {
    const field = document.createElement('input');
    field.id = 'field-b';
    field.focus = vi.fn();
    field.scrollIntoView = vi.fn();
    document.body.append(field);

    scrollToFirstError(['missing', 'field-b']);

    expect(field.scrollIntoView).toHaveBeenCalled();
    expect(field.focus).toHaveBeenCalled();
  });
});
