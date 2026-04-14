import { describe, it, expect } from 'vitest';
import { validateUrl } from '../../lib/validation';

describe('validateUrl', () => {
  it('accepts a valid https URL', () => {
    expect(validateUrl('https://www.amazon.in/dp/B09XYZ')).toBe(true);
  });

  it('accepts a valid http URL', () => {
    expect(validateUrl('http://flipkart.com/product/123')).toBe(true);
  });

  it('accepts a URL with query params', () => {
    expect(validateUrl('https://amazon.com/dp/B09?tag=foo&ref=sr')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(validateUrl('')).toBe(false);
  });

  it('rejects a plain word (no protocol)', () => {
    expect(validateUrl('notaurl')).toBe(false);
  });

  it('rejects a string with only slashes', () => {
    expect(validateUrl('//amazon.com/dp/B09')).toBe(false);
  });

  it('rejects a ftp:// URL', () => {
    expect(validateUrl('ftp://files.example.com/file.zip')).toBe(false);
  });

  it('rejects a javascript: URI', () => {
    expect(validateUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects a string with spaces', () => {
    expect(validateUrl('https://amazon .com/dp')).toBe(false);
  });
});
