export interface StorageItem {
  astId: number;
  contract: string;
  label: string;
  offset: number;
  slot: string;
  type: string;
}

export interface TypeItem {
  encoding: string;
  label: string;
  numberOfBytes: string;
  base?: string;
  key?: string;
  value?: string;
  members?: Member[];
}

export interface Member {
  astId: number;
  contract: string;
  label: string;
  offset: number;
  slot: string;
  type: string;
}

export interface Storage {
  storage: StorageItem[];
  types: { [key: string]: TypeItem };
}

export interface StorageItemForComparison {
  label: string;
  offset: number;
  slot: string;
  type: string;
  numberOfBytes: string;
}

export interface ComparedStorageItem extends StorageItemForComparison {
  status: 'added' | 'removed' | 'unchanged';
}
