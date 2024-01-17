import matter from 'gray-matter';
import { baseToCidv0 } from './hash';

export type ProposalMetadata = {
  title: string;
  description: string;
  ipfsHash: string;
  discussions: string;
  author: string;
};

export function getLink(hash: string, gateway: string): string {
  return `${gateway}/${hash}`;
}

export async function getProposalMetadata(
  hash: string,
  gateway: string = 'https://cloudflare-ipfs.com/ipfs',
): Promise<ProposalMetadata> {
  const ipfsHash = hash.startsWith('0x') ? baseToCidv0(hash) : hash;
  const ipfsPath = getLink(ipfsHash, gateway);
  const ipfsResponse = await fetch(ipfsPath, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!ipfsResponse.ok) throw Error(`IPFS: error fetching ${ipfsPath}`);
  const clone = await ipfsResponse.clone();
  try {
    const response = await ipfsResponse.json();
    const { content, data } = matter(response.description);
    return {
      ...response,
      ipfsHash,
      description: content,
      ...data,
    };
    // matter will error in case the proposal is not valid yaml (like on proposal 0)
    // therefore in the case of an error we just inline the complete ipfs content
  } catch (e) {
    const { content, data } = matter(await clone.text());
    return {
      ...ipfsResponse,
      ipfsHash,
      description: content,
      ...(data as { title: string; discussions: string; author: string }),
    };
  }
}
