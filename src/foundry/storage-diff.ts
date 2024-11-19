import type {
  StorageItemForComparison,
  ComparedStorageItem,
  Storage,
} from './types';

/**
 * Generates a markdown table comparing two foundry storage layout snapshots
 * @param layoutBefore
 * @param layoutAfter
 * @returns markdown string
 */
export function compareStorageLayouts(
  layoutBefore: Storage,
  layoutAfter: Storage,
) {
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

  // output MD
  const md = generateMarkdownOutput(comparison);
  return md;
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
  markdownTable += ` | ${'Label'.padEnd(
    columnWidths.name,
    ' ',
  )} | ${'Offset'.padEnd(columnWidths.offset, ' ')} | ${'Slot'.padEnd(
    columnWidths.slot,
    ' ',
  )} | ${'Type'.padEnd(columnWidths.type, ' ')} | ${'Bytes'.padEnd(
    columnWidths.numberOfBytes,
    ' ',
  )} |\n`;

  markdownTable += ` |${'-'.repeat(columnWidths.name + 2)}|${'-'.repeat(
    columnWidths.offset + 2,
  )}|${'-'.repeat(columnWidths.slot + 2)}|${'-'.repeat(
    columnWidths.type + 2,
  )}|${'-'.repeat(columnWidths.numberOfBytes + 2)}||\n`;

  // Iterate over each item and add it as a row in the table
  items.forEach((item) => {
    const sign =
      item.status === 'added' ? '+' : item.status === 'removed' ? '-' : ' ';

    const row = `${sign}| ${item.label.padEnd(
      columnWidths.name,
      ' ',
    )} | ${item.offset
      .toString()
      .padEnd(columnWidths.offset, ' ')} | ${item.slot.padEnd(
        columnWidths.slot,
        ' ',
      )} | ${item.type.padEnd(
        columnWidths.type,
        ' ',
      )} | ${item.numberOfBytes.padEnd(columnWidths.numberOfBytes, ' ')} |\n`;

    markdownTable += row;
  });

  markdownTable += '```';

  return markdownTable;
}
