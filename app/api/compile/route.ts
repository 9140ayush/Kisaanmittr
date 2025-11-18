import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections, userId } = body;

    console.log('📄 PDF compilation request received');
    console.log(`   Sections count: ${sections?.length || 0}`);

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      console.error('❌ Invalid request: sections array is required');
      return NextResponse.json({
        success: false,
        error: 'Sections array is required',
        details: 'Please provide at least one section with name and content',
      }, { status: 400 });
    }

    // Validate sections have required fields
    const invalidSections = sections.filter(
      (section: any) => !section.name || typeof section.content !== 'string'
    );
    if (invalidSections.length > 0) {
      console.error('❌ Invalid sections found:', invalidSections.length);
      return NextResponse.json({
        success: false,
        error: 'Invalid sections',
        details: 'Each section must have a name and content field',
      }, { status: 400 });
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
    sections.forEach((section: any, index: number) => {
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
    for (let index = 0; index < sections.length; index++) {
      const section = sections[index];
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
      
      // Handle empty content
      if (!content || content.trim().length === 0) {
        if (yPosition < 100) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }
        page.drawText('(No content provided)', {
          x: margin,
          y: yPosition,
          size: 11,
          font: font,
          color: rgb(0.5, 0.5, 0.5), // Gray color for empty content
        });
        yPosition -= lineHeight;
        continue; // Skip to next section
      }

      // Split content into words and handle line wrapping
      const words = content.split(/\s+/).filter((word: string) => word.length > 0);
      let currentLine = '';

      words.forEach((word: string) => {
        // Handle newlines in content
        if (word.includes('\n')) {
          const lines = word.split('\n');
          lines.forEach((line: string, lineIndex: number) => {
            if (lineIndex === 0) {
              // First part of the word
              const testLine = currentLine + (currentLine ? ' ' : '') + line;
              const textWidth = font.widthOfTextAtSize(testLine, 11);
              
              if (textWidth > pageWidth - 2 * margin && currentLine) {
                // Draw current line and start new line
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
                currentLine = line;
              } else {
                currentLine = testLine;
              }
            } else {
              // Subsequent lines (after newline)
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
              }
              currentLine = line;
            }
          });
          return;
        }

        // Regular word wrapping
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = font.widthOfTextAtSize(testLine, 11);

        if (textWidth > pageWidth - 2 * margin) {
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
          }
          currentLine = word;
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
        yPosition -= lineHeight;
      }
    }

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
    console.log('🔄 Generating PDF bytes...');
    const pdfBytes = await pdfDoc.save();
    console.log(`✅ PDF generated successfully (${pdfBytes.length} bytes)`);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `kisaanmittr-report-${timestamp}.pdf`;

    // Return PDF as binary response
    console.log(`📤 Sending PDF response: ${filename} (${pdfBytes.length} bytes)`);
    
    // Ensure pdfBytes is a Uint8Array/Buffer
    const pdfBuffer = Buffer.from(pdfBytes);
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    // Enhanced error logging
    console.error('❌ PDF compilation error:', {
      message: error.message,
      type: error.constructor.name,
      stack: error.stack,
    });

    // Return JSON error response
    return NextResponse.json({
      success: false,
      error: 'Failed to compile PDF',
      details: error.message || 'An unexpected error occurred during PDF generation',
    }, { status: 500 });
  }
}
