#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import meow from 'meow';
import { extractPdfMetadata } from './extractPdfMetadata.js';
const cli = meow(`
    Usage
      $ pdf-metadata-extractor [inputFolder]

    Options
      --configJsonFile, -c   Config file name
      --outputJsonFile, -o   Output file name
    `, {
    importMeta: import.meta,
    flags: {
        configJsFile: {
            type: 'string',
            shortFlag: 'c'
        },
        outputJsonFile: {
            type: 'string',
            shortFlag: 'o'
        }
    }
});
const inputFolder = cli.input[0] ?? process.cwd();
console.log(`Input Folder: ${inputFolder}`);
const configJsonFile = cli.flags.configJsFile ?? path.join(process.cwd(), 'config.default.json');
const configData = fs.readFileSync(configJsonFile);
const config = JSON.parse(configData);
console.log(`Configuration: ${JSON.stringify(config)}`);
const outputJsonFile = cli.flags.outputJsonFile ?? path.join(process.cwd(), 'metadata.json');
console.log(`Output File: ${outputJsonFile}`);
const allMetadata = await extractPdfMetadata(inputFolder, config);
console.log(allMetadata);
fs.writeFileSync(outputJsonFile, JSON.stringify(allMetadata, undefined, 2));
