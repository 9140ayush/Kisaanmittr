import { type NextRequest, NextResponse } from "next/server"
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save file temporarily
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExtension = path.extname(file.name).toLowerCase();
    const tempFilePath = path.join(uploadsDir, `${Date.now()}-${file.name}`);

    try {
      await fs.writeFile(tempFilePath, buffer);

      let extractedText = '';

      switch (fileExtension) {
        case '.pdf':
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text;
          break;

        case '.docx':
          const docxResult = await mammoth.extractRawText({ buffer: buffer });
          extractedText = docxResult.value;
          break;

        case '.xlsx':
        case '.xls':
          const workbook = XLSX.read(buffer, { type: 'buffer' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          extractedText = XLSX.utils.sheet_to_txt(worksheet);
          break;

        default:
          throw new Error('Unsupported file format. Only PDF, DOCX, and XLSX files are allowed.');
      }

      // Clean up uploaded file
      await fs.unlink(tempFilePath);

      return NextResponse.json({
        success: true,
        content: extractedText,
        fileName: file.name,
        fileType: fileExtension,
        fileSize: file.size,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      // Clean up file on error
      try {
        await fs.unlink(tempFilePath).catch(() => {});
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }

      throw error;
    }
  } catch (error: any) {
    console.error('File parsing error:', error);
    
    // Check for invalid file type
    if (error.message && error.message.includes('Invalid file type') || error.message.includes('Unsupported file format')) {
      return NextResponse.json({
        error: 'Invalid file type',
        details: error.message,
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Failed to parse file',
      details: error.message || 'An unexpected error occurred',
    }, { status: 500 });
  }
}
