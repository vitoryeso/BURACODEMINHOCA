import { jsPDF } from 'jspdf';
import { themes } from '../src/data.mjs';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('./examples');
const outFile = path.join(outDir, 'mapa-de-rimas-exemplo.pdf');

fs.mkdirSync(outDir, { recursive: true });

const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

const left = 16; // mm
const top = 18; // mm
const right = 16; // mm
const pageWidth = 210;
const contentWidth = pageWidth - left - right;

const titleFontSize = 18; // pt
const wordFontSize = 12; // pt
const colGap = 6; // mm
const cols = 3;
const chipPaddingY = 2.2; // mm approx for 12pt
const chipPaddingX = 2.6; // mm
const rowGap = 3.8; // mm

for (let tIndex = 0; tIndex < themes.length; tIndex++) {
  const theme = themes[tIndex];
  if (tIndex > 0) doc.addPage();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(titleFontSize);
  doc.text(`Tema: ${theme.name}`, left, top);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(wordFontSize);

  const usableTop = top + 10; // abaixo do título
  const colWidth = (contentWidth - (colGap * (cols - 1))) / cols;
  let x = left;
  let y = usableTop;
  let col = 0;

  for (const word of theme.words) {
    const textLines = doc.splitTextToSize(word, colWidth - chipPaddingX * 2);
    const lineHeight = 5; // mm approx for 12pt
    const chipHeight = textLines.length * lineHeight + chipPaddingY * 2;

    doc.setDrawColor(210, 218, 226);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, colWidth, chipHeight, 2, 2, 'FD');
    doc.setTextColor(20, 20, 20);
    doc.text(textLines, x + chipPaddingX, y + chipPaddingY + 3.5);

    y += chipHeight + rowGap;
    if (y > 287) { // page height - margin
      col += 1;
      if (col >= cols) {
        doc.addPage();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(titleFontSize);
        doc.text(`Tema: ${theme.name}`, left, top);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(wordFontSize);
        col = 0; x = left; y = usableTop;
      } else {
        x = left + col * (colWidth + colGap);
        y = usableTop;
      }
    }
  }
}

const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(outFile, Buffer.from(pdfBytes));
console.log('PDF gerado em:', outFile);
