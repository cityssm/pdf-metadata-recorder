#!/usr/bin/env node

/* eslint-disable node/shebang */
/* eslint-disable import/no-unresolved */

import fs from 'node:fs'
import path from 'node:path'

import meow from 'meow'

import { extractPdfMetadata } from './extractPdfMetadata.js'

const cli = meow(
  `
    Usage
      $ pdf-metadata-extractor [inputFolder]

    Options
      --configJsonFile, -c   Config file name
      --outputJsonFile, -o   Output file name
    `,
  {
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
  }
)

/*
 * Input folder
 */

const inputFolder = cli.input[0] ?? process.cwd()

console.log(`Input Folder: ${inputFolder}`)

/*
 * Config JSON
 */

const configJsonFile =
  cli.flags.configJsFile ?? path.join(process.cwd(), 'config.default.json')

const configData = fs.readFileSync(configJsonFile)
const config = JSON.parse(configData as unknown as string)

console.log(`Configuration: ${JSON.stringify(config)}`)

/*
 * Output JSON
 */

const outputJsonFile =
  cli.flags.outputJsonFile ?? path.join(process.cwd(), 'metadata.json')

console.log(`Output File: ${outputJsonFile}`)

const allMetadata = await extractPdfMetadata(inputFolder, config)

console.log(allMetadata)

/*
 * Write the file
 */

fs.writeFileSync(outputJsonFile, JSON.stringify(allMetadata, undefined, 2))
