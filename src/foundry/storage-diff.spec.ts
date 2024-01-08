import { describe, it, expect } from 'vitest';
import { compareStorageLayouts } from './storage-diff';
import current from './mocks/currentStakedAave.json';
import next from './mocks/nextStakedAave.json';

describe('compareStorageLayouts', () => {
  it('should generate the correct output', () => {
    expect(compareStorageLayouts(current, next)).toMatchSnapshot();
  });
});
