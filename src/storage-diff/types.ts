interface StorageItem {
  astId: number;
  contract: string;
  label: string;
  offset: number;
  slot: string;
  type: string;
}

interface TypeItem {
  encoding: string;
  label: string;
  numberOfBytes: string;
  base?: string;
  key?: string;
  value?: string;
  members?: Member[];
}

interface Member {
  astId: number;
  contract: string;
  label: string;
  offset: number;
  slot: string;
  type: string;
}

interface Storage {
  storage: StorageItem[];
  types: { [key: string]: TypeItem };
}
