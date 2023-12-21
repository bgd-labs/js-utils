import * as fs from 'fs';
import {
  StorageItemForComparison,
  ComparedStorageItem,
  Storage,
} from './types.ts';

export function compareStorageLayouts(filepath1: string, filepath2: string) {
  if (!fs.existsSync(filepath1)) {
    throw new Error(`${filepath1} not found.`);
  }

  if (!fs.existsSync(filepath2)) {
    throw new Error(`${filepath2} not found.`);
  }

  const layoutBefore = JSON.parse(
    fs.readFileSync(filepath1, 'utf8'),
  ) as Storage;
  const layoutAfter = JSON.parse(fs.readFileSync(filepath2, 'utf8')) as Storage;

  // preformat jsons
  const layoutForComparisonBefore: StorageItemForComparison[] =
    preformatStorageLayout(layoutBefore);

  const layoutForComparisonAfter: StorageItemForComparison[] =
    preformatStorageLayout(layoutAfter);

  // compare arrays
  const comparison: ComparedStorageItem[] = compareStorageArrays(
    layoutForComparisonBefore,
    layoutForComparisonAfter,
  );

  // console.log(comparison);

  // output MD
  const md = generateMarkdownOutput(comparison);
  console.log(md);
}

function preformatStorageLayout(json: Storage): StorageItemForComparison[] {
  return json.storage.map((item) => ({
    label: item.label,
    offset: item.offset,
    slot: item.slot,
    type: json.types[item.type].label,
    numberOfBytes: json.types[item.type].numberOfBytes,
  }));
}

function compareStorageArrays(
  oldArray: StorageItemForComparison[],
  newArray: StorageItemForComparison[],
): ComparedStorageItem[] {
  const changes: ComparedStorageItem[] = [];

  const oldMap = new Map(
    oldArray.map((item) => [item.slot + '-' + item.offset, item]),
  );
  const newMap = new Map(
    newArray.map((item) => [item.slot + '-' + item.offset, item]),
  );

  // Find removed and changed elements
  oldArray.forEach((oldItem) => {
    const newItem = newMap.get(oldItem.slot + '-' + oldItem.offset);
    if (!newItem) {
      changes.push({ ...oldItem, status: 'removed' });
    } else if (isDifferent(oldItem, newItem)) {
      changes.push({ ...oldItem, status: 'removed' });
      changes.push({ ...newItem, status: 'added' });
    } else {
      changes.push({ ...newItem, status: 'unchanged' });
    }
  });

  // Find added elements
  newArray.forEach((newItem) => {
    if (!oldMap.has(newItem.slot + '-' + newItem.offset)) {
      changes.push({ ...newItem, status: 'added' });
    }
  });

  // Sort the changes by slot and offset
  changes.sort((a, b) => {
    if (a.slot === b.slot) {
      return a.offset - b.offset;
    }
    return a.slot.localeCompare(b.slot);
  });

  return changes;
}

function isDifferent(
  item1: StorageItemForComparison,
  item2: StorageItemForComparison,
): boolean {
  return (
    item1.offset !== item2.offset ||
    item1.slot !== item2.slot ||
    item1.type !== item2.type ||
    item1.numberOfBytes !== item2.numberOfBytes
  );
}

function generateMarkdownOutput(items: ComparedStorageItem[]): string {
  // Calculate padding for each column for prettification
  const columnWidths = {
    name: Math.max(...items.map((item) => item.label.length), 'Label'.length),
    offset: 'Offset'.length,
    slot: 'Slot'.length,
    type: Math.max(...items.map((item) => item.type.length), 'Type'.length),
    numberOfBytes: 'Bytes'.length,
  };

  let markdownTable = '```diff\n';

  // Generate the table header
  markdownTable += ` | ${padString('Label', columnWidths.name)} | ${padString(
    'Offset',
    columnWidths.offset,
  )} | ${padString('Slot', columnWidths.slot)} | ${padString(
    'Type',
    columnWidths.type,
  )} | ${padString('Bytes', columnWidths.numberOfBytes)} |\n`;

  markdownTable += ` |${'-'.repeat(columnWidths.name + 2)}|${'-'.repeat(
    columnWidths.offset + 2,
  )}|${'-'.repeat(columnWidths.slot + 2)}|${'-'.repeat(
    columnWidths.type + 2,
  )}|${'-'.repeat(columnWidths.numberOfBytes + 2)}||\n`;

  // Iterate over each item and add it as a row in the table
  items.forEach((item) => {
    const sign =
      item.status === 'added' ? '+' : item.status === 'removed' ? '-' : ' ';

    const row = `${sign}| ${padString(
      item.label,
      columnWidths.name,
    )} | ${padString(
      item.offset.toString(),
      columnWidths.offset,
    )} | ${padString(item.slot, columnWidths.slot)} | ${padString(
      item.type,
      columnWidths.type,
    )} | ${padString(item.numberOfBytes, columnWidths.numberOfBytes)} |\n`;

    markdownTable += row;
  });

  markdownTable += '```';

  return markdownTable;
}

function padString(str: string, length: number): string {
  // Add padding to the string to reach the desired length
  return str + ' '.repeat(length - str.length);
}

compareStorageLayouts('reports/storage1.json', 'reports/storage2.json');
