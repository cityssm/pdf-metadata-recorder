import fs from 'node:fs';
import path from 'node:path';
import pdfJS from 'pdfjs-dist/legacy/build/pdf.js';
const fileNameRegularExpression = /\.pdf/i;
export async function extractPdfMetadata(inputFolder, configOptions) {
    const allMetadata = [];
    const fileNames = fs.readdirSync(inputFolder);
    for (const fileName of fileNames) {
        if (!fileNameRegularExpression.test(fileName)) {
            continue;
        }
        const pdfDocument = await pdfJS.getDocument(path.join(inputFolder, fileName)).promise;
        const metadata = {
            fileName
        };
        if (configOptions.outline) {
            metadata.outline = [];
            const outline = (await pdfDocument.getOutline()) ?? [];
            for (const outlineHeading of outline) {
                metadata.outline.push(outlineHeading.title);
            }
        }
        allMetadata.push(metadata);
    }
    return allMetadata;
}
