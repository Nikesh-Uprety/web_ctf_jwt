import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

export const config = {
    api: {
        bodyParser: false,
    },
};

// Hidden flag in various locations - the rabbit hole begins here
const HIDDEN_FLAGS = {
    metadata: "CTF{m3t4d4t4_1s_3v3ryth1ng}",
    deep: "CTF{d33p_1n_th3_r4bb1t_h0l3}",
    final: "CTF{y0u_f0und_th3_ultim4t3_s3cr3t}"
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = formidable({
        uploadDir: '/tmp',
        keepExtensions: true,
        maxFileSize: 50 * 1024 * 1024, // 50MB - generous limit for the honeypot
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Upload failed' });
        }

        const uploadedFile = files.file;
        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const filePath = Array.isArray(uploadedFile) ? uploadedFile[0].filepath : uploadedFile.filepath;
        const fileName = Array.isArray(uploadedFile) ? uploadedFile[0].originalFilename : uploadedFile.originalFilename;
        const fileSize = Array.isArray(uploadedFile) ? uploadedFile[0].size : uploadedFile.size;
        const mimeType = Array.isArray(uploadedFile) ? uploadedFile[0].mimetype : uploadedFile.mimetype;

        try {
            // Read file for analysis
            const fileBuffer = fs.readFileSync(filePath);
            const fileHash = createHash('sha256').update(fileBuffer).digest('hex');
            
            // Simulate advanced analysis
            const analysisResult = {
                filename: fileName,
                size: fileSize,
                type: mimeType,
                hash: fileHash,
                scanTime: new Date().toISOString(),
                threats: [],
                metadata: {
                    // Hidden flag in metadata
                    internalId: `scan_${Date.now()}`,
                    processingFlags: HIDDEN_FLAGS.metadata,
                    deepScanEnabled: true,
                    // More hidden data
                    systemNotes: "Advanced threat detection active. Recursive analysis depth: 7 levels.",
                    hiddenProperties: {
                        level1: {
                            level2: {
                                level3: {
                                    level4: {
                                        level5: {
                                            level6: {
                                                level7: HIDDEN_FLAGS.deep
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                // Simulate finding suspicious patterns
                patterns: [
                    "No malicious signatures detected",
                    "File structure appears normal",
                    "Entropy analysis: PASSED",
                    "Hidden data streams: NONE DETECTED"
                ],
                recommendations: [
                    "File appears safe for processing",
                    "Consider additional sandboxing for unknown file types",
                    "Monitor for unusual network activity post-processing"
                ]
            };

            // Add special response headers with hidden information
            res.setHeader('X-Scan-ID', `scan_${Date.now()}`);
            res.setHeader('X-Processing-Time', '0.847ms');
            res.setHeader('X-Threat-Level', 'LOW');
            res.setHeader('X-Hidden-Flag', Buffer.from(HIDDEN_FLAGS.final).toString('base64'));
            res.setHeader('X-System-Version', '2.1.337');
            res.setHeader('X-Debug-Info', 'Check response headers for additional data');

            // Clean up uploaded file
            fs.unlinkSync(filePath);

            res.status(200).json({
                message: 'File analysis completed successfully',
                status: 'SAFE',
                analysis: analysisResult,
                // Another flag location
                systemInfo: {
                    version: '2.1.337',
                    buildId: 'build_' + HIDDEN_FLAGS.metadata.replace('CTF{', '').replace('}', ''),
                    lastUpdate: '2024-01-15T10:30:00Z'
                }
            });

        } catch (error) {
            // Clean up on error
            try {
                fs.unlinkSync(filePath);
            } catch (cleanupErr) {
                console.log('Cleanup error:', cleanupErr.message);
            }

            res.status(500).json({
                error: 'Analysis failed',
                details: 'Internal processing error occurred'
            });
        }
    });
}