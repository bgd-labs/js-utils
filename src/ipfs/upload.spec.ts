import { describe, it, expect } from 'vitest';
import { uploadToQuicknode } from './upload';

describe('upload', () => {
  it('upload to quicknode', async () => {
    // if (!process.env.QUICKNODE_API_KEY) return;
    const response = await uploadToQuicknode('BoredGhosts');
    console.log(response);
  });
});
