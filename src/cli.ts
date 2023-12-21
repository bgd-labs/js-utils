#!/usr/bin/env node
import { program } from 'commander';
import { compareStorageLayouts } from './storage-diff';

program
  .command('storage-diff')
  .description('Compare two storage layout files')
  .argument('<layout1Path>', 'path to the first storage layout file')
  .argument('<layout2Path>', 'path to the second storage layout file')
  .option('-o, --output <filename>', 'output filename', 'storage-diff')
  .action((layout1Path, layout2Path, options) => {
    const outputFilename = options.output || 'storage-diff';
    compareStorageLayouts(layout1Path, layout2Path, outputFilename);
    console.log(`Comparing storage layouts: ${layout1Path} vs ${layout2Path}`);
    console.log(`The differences will be saved in ${outputFilename}`);
  });

program.parse();
