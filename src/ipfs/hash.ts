import { encode } from 'bs58';

export function baseToCidv0(hash: string) {
  return encode(Buffer.from(`1220${hash.slice(2)}`, 'hex'));
}
