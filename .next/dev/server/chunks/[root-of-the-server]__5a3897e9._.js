module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/compile/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/api/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/api/colors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$StandardFonts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/api/StandardFonts.js [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { sections, userId } = body;
        console.log('📄 PDF compilation request received');
        console.log(`   Sections count: ${sections?.length || 0}`);
        if (!sections || !Array.isArray(sections) || sections.length === 0) {
            console.error('❌ Invalid request: sections array is required');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Sections array is required',
                details: 'Please provide at least one section with name and content'
            }, {
                status: 400
            });
        }
        // Validate sections have required fields
        const invalidSections = sections.filter((section)=>!section.name || typeof section.content !== 'string');
        if (invalidSections.length > 0) {
            console.error('❌ Invalid sections found:', invalidSections.length);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid sections',
                details: 'Each section must have a name and content field'
            }, {
                status: 400
            });
        }
        // Create a new PDF document
        const pdfDoc = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PDFDocument"].create();
        const font = await pdfDoc.embedFont(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$StandardFonts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StandardFonts"].Helvetica);
        const boldFont = await pdfDoc.embedFont(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$StandardFonts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StandardFonts"].HelveticaBold);
        let yPosition = 750;
        const pageWidth = 595;
        const pageHeight = 842;
        const margin = 50;
        const lineHeight = 20;
        const sectionSpacing = 30;
        // Helper function to add a new page if needed
        const checkNewPage = ()=>{
            if (yPosition < 100) {
                const newPage = pdfDoc.addPage([
                    pageWidth,
                    pageHeight
                ]);
                yPosition = pageHeight - margin;
                return newPage;
            }
        };
        // Add title page
        let page = pdfDoc.addPage([
            pageWidth,
            pageHeight
        ]);
        page.drawText('Kisaanmittr Report', {
            x: margin,
            y: pageHeight - 100,
            size: 24,
            font: boldFont,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0.13, 0.39, 0.23)
        });
        page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
            x: margin,
            y: pageHeight - 140,
            size: 12,
            font: font,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0.3, 0.3, 0.3)
        });
        // Table of Contents
        yPosition = pageHeight - 200;
        page.drawText('Table of Contents', {
            x: margin,
            y: yPosition,
            size: 16,
            font: boldFont,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0, 0, 0)
        });
        yPosition -= 30;
        sections.forEach((section, index)=>{
            if (yPosition < 100) {
                page = pdfDoc.addPage([
                    pageWidth,
                    pageHeight
                ]);
                yPosition = pageHeight - margin;
            }
            page.drawText(`${index + 1}. ${section.name}`, {
                x: margin + 20,
                y: yPosition,
                size: 12,
                font: font,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0, 0, 0)
            });
            yPosition -= lineHeight;
        });
        // Add sections
        for(let index = 0; index < sections.length; index++){
            const section = sections[index];
            page = pdfDoc.addPage([
                pageWidth,
                pageHeight
            ]);
            yPosition = pageHeight - margin;
            // Section header
            page.drawText(`${index + 1}. ${section.name}`, {
                x: margin,
                y: yPosition,
                size: 18,
                font: boldFont,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0.13, 0.39, 0.23)
            });
            yPosition -= sectionSpacing;
            // Section content
            const content = section.content || '';
            // Handle empty content
            if (!content || content.trim().length === 0) {
                if (yPosition < 100) {
                    page = pdfDoc.addPage([
                        pageWidth,
                        pageHeight
                    ]);
                    yPosition = pageHeight - margin;
                }
                page.drawText('(No content provided)', {
                    x: margin,
                    y: yPosition,
                    size: 11,
                    font: font,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0.5, 0.5, 0.5)
                });
                yPosition -= lineHeight;
                continue; // Skip to next section
            }
            // Split content into words and handle line wrapping
            const words = content.split(/\s+/).filter((word)=>word.length > 0);
            let currentLine = '';
            words.forEach((word)=>{
                // Handle newlines in content
                if (word.includes('\n')) {
                    const lines = word.split('\n');
                    lines.forEach((line, lineIndex)=>{
                        if (lineIndex === 0) {
                            // First part of the word
                            const testLine = currentLine + (currentLine ? ' ' : '') + line;
                            const textWidth = font.widthOfTextAtSize(testLine, 11);
                            if (textWidth > pageWidth - 2 * margin && currentLine) {
                                // Draw current line and start new line
                                if (yPosition < 100) {
                                    page = pdfDoc.addPage([
                                        pageWidth,
                                        pageHeight
                                    ]);
                                    yPosition = pageHeight - margin;
                                }
                                page.drawText(currentLine, {
                                    x: margin,
                                    y: yPosition,
                                    size: 11,
                                    font: font,
                                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0, 0, 0)
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
                                    page = pdfDoc.addPage([
                                        pageWidth,
                                        pageHeight
                                    ]);
                                    yPosition = pageHeight - margin;
                                }
                                page.drawText(currentLine, {
                                    x: margin,
                                    y: yPosition,
                                    size: 11,
                                    font: font,
                                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0, 0, 0)
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
                            page = pdfDoc.addPage([
                                pageWidth,
                                pageHeight
                            ]);
                            yPosition = pageHeight - margin;
                        }
                        page.drawText(currentLine, {
                            x: margin,
                            y: yPosition,
                            size: 11,
                            font: font,
                            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0, 0, 0)
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
                    page = pdfDoc.addPage([
                        pageWidth,
                        pageHeight
                    ]);
                    yPosition = pageHeight - margin;
                }
                page.drawText(currentLine, {
                    x: margin,
                    y: yPosition,
                    size: 11,
                    font: font,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0, 0, 0)
                });
                yPosition -= lineHeight;
            }
        }
        // Add page numbers
        const pages = pdfDoc.getPages();
        pages.forEach((page, index)=>{
            const pageNumber = (index + 1).toString();
            const textWidth = font.widthOfTextAtSize(pageNumber, 10);
            page.drawText(pageNumber, {
                x: (pageWidth - textWidth) / 2,
                y: 30,
                size: 10,
                font: font,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(0.5, 0.5, 0.5)
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
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': pdfBuffer.length.toString(),
                'Cache-Control': 'no-cache'
            }
        });
    } catch (error) {
        // Enhanced error logging
        console.error('❌ PDF compilation error:', {
            message: error.message,
            type: error.constructor.name,
            stack: error.stack
        });
        // Return JSON error response
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to compile PDF',
            details: error.message || 'An unexpected error occurred during PDF generation'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5a3897e9._.js.map