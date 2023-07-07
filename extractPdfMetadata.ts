import fs from 'node:fs'
import path from 'node:path'

import pdfJS from 'pdfjs-dist/legacy/build/pdf.js'

import type * as types from './types'

const fileNameRegularExpression = /\.pdf/i

export async function extractPdfMetadata(
  inputFolder: string,
  configOptions: types.Config
): Promise<types.PdfMetadata[]> {
  const allMetadata: types.PdfMetadata[] = []

  const fileNames = fs.readdirSync(inputFolder)

  for (const fileName of fileNames) {
    if (!fileNameRegularExpression.test(fileName)) {
      continue
    }

    const pdfDocument = await pdfJS.getDocument(
      path.join(inputFolder, fileName)
    ).promise

    const metadata: types.PdfMetadata = {
      fileName
    }

    // Outline

    if (configOptions.outline) {
      metadata.outline = []

      const outline = (await pdfDocument.getOutline()) ?? []

      for (const outlineHeading of outline) {
        metadata.outline.push(outlineHeading.title.trim())
      }
    }

    // Metadata object

    const documentMetadata = await pdfDocument.getMetadata()
    const documentMetadataInfo = documentMetadata.info as {
      Author?: string
      Title?: string
    }

    if (configOptions.author) {
      metadata.author = documentMetadataInfo.Author ?? ''
    }

    if (configOptions.title) {
      metadata.title = documentMetadataInfo.Title ?? ''
    }

    // Headings

    if (configOptions.fullContent) {
      metadata.fullContent = ''

      for (
        let pageNumber = 1;
        pageNumber <= pdfDocument.numPages;
        pageNumber += 1
      ) {
        const page = await pdfDocument.getPage(pageNumber)

        if (configOptions.fullContent) {
          const textContent = await page.getTextContent()
          metadata.fullContent += textContent.items.reduce(
            (soFar, currentText) => {
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              return soFar + ' ' + currentText.str
            },
            ''
          )
        }
      }
    }

    // Push output

    allMetadata.push(metadata)
  }

  return allMetadata
}
