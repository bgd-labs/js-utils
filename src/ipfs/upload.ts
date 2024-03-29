export async function uploadToPinata(source: string) {
  const PINATA_KEY = process.env.PINATA_KEY;
  if (!PINATA_KEY) throw new Error('PINATA_KEY env must be set');
  const PINATA_SECRET = process.env.PINATA_SECRET;
  if (!PINATA_SECRET) throw new Error('PINATA_SECRET env must be set');
  const data = new FormData();
  data.append('file', new Blob([source]));
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    body: data,
    headers: {
      pinata_api_key: PINATA_KEY,
      pinata_secret_api_key: PINATA_SECRET,
    },
  });

  if (!res.ok) {
    throw Error(await res.text());
  }

  const result = await res.json();

  if (result.error) throw { message: result.error };
  return result;
}

export async function uploadToTheGraph(source: string) {
  const data = new FormData();
  data.append('file', new Blob([source]));
  const res = await fetch('https://api.thegraph.com/ipfs/api/v0/add', {
    method: 'POST',
    body: data,
  });
  return res.json();
}

export async function uploadToQuicknode(source: string, key?: string) {
  const apiKey = process.env.QUICKNODE_API_KEY!;
  const headers = new Headers();
  headers.append('x-api-key', apiKey);
  const data = new FormData();
  data.append('Body', new Blob([source]));
  data.append('Key', key || 'unknownKey');
  data.append('ContentType', 'text/plain');
  const res = await fetch(
    'https://api.quicknode.com/ipfs/rest/v1/s3/put-object',
    {
      method: 'POST',
      headers,
      body: data,
      redirect: 'follow',
    },
  );
  return res.text();
}
