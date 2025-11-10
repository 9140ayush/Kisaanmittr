import express from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { sections, userId } = req.body;

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({
        error: 'Sections array is required',
      });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = 750;
    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 50;
    const lineHeight = 20;
    const sectionSpacing = 30;

    // Helper function to add a new page if needed
    const checkNewPage = () => {
      if (yPosition < 100) {
        const newPage = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
        return newPage;
      }
    };

    // Add title page
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawText('Kisaanmittr Report', {
      x: margin,
      y: pageHeight - 100,
      size: 24,
      font: boldFont,
      color: rgb(0.13, 0.39, 0.23), // Primary green color
    });

    page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
      x: margin,
      y: pageHeight - 140,
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Table of Contents
    yPosition = pageHeight - 200;
    page.drawText('Table of Contents', {
      x: margin,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;
    sections.forEach((section, index) => {
      if (yPosition < 100) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }
      page.drawText(`${index + 1}. ${section.name}`, {
        x: margin + 20,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    });

    // Add sections
    sections.forEach((section, index) => {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;

      // Section header
      page.drawText(`${index + 1}. ${section.name}`, {
        x: margin,
        y: yPosition,
        size: 18,
        font: boldFont,
        color: rgb(0.13, 0.39, 0.23),
      });

      yPosition -= sectionSpacing;

      // Section content
      const content = section.content || '';
      const words = content.split(' ');
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = font.widthOfTextAtSize(testLine, 11);

        if (textWidth > pageWidth - 2 * margin || word.includes('\n')) {
          if (currentLine) {
            if (yPosition < 100) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              yPosition = pageHeight - margin;
            }
            page.drawText(currentLine, {
              x: margin,
              y: yPosition,
              size: 11,
              font: font,
              color: rgb(0, 0, 0),
            });
            yPosition -= lineHeight;
            currentLine = word.replace('\n', '');
          }
        } else {
          currentLine = testLine;
        }
      });

      // Draw remaining text
      if (currentLine) {
        if (yPosition < 100) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: 11,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    });

    // Add page numbers
    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      const pageNumber = (index + 1).toString();
      const textWidth = font.widthOfTextAtSize(pageNumber, 10);
      page.drawText(pageNumber, {
        x: (pageWidth - textWidth) / 2,
        y: 30,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Convert to base64 for response
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    res.json({
      success: true,
      pdf: base64Pdf,
      message: 'PDF compiled successfully',
    });
  } catch (error) {
    console.error('PDF compilation error:', error);
    res.status(500).json({
      error: 'Failed to compile PDF',
      details: error.message,
    });
  }
});

export default router;

