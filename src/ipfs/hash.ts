import bs58 from 'bs58';

export function baseToCidv0(hash: string) {
  return bs58.encode(Buffer.from(`1220${hash.slice(2)}`, 'hex'));
}
