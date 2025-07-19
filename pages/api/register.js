import jwt from 'jsonwebtoken';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const form = formidable({
        uploadDir: '/tmp',
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Form parsing failed' });
        }

        const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
        const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
        const avatar = files.avatar;

        if (!username || !password) {
            return res.status(400).json({ error: 'Missing credentials' });
        }

        if (!avatar) {
            return res.status(400).json({ error: 'Avatar image is required' });
        }

        // Process avatar (store metadata for potential flag hiding)
        const avatarPath = Array.isArray(avatar) ? avatar[0].filepath : avatar.filepath;
        const avatarName = Array.isArray(avatar) ? avatar[0].originalFilename : avatar.originalFilename;
        
        // Store avatar metadata (this could contain hidden information)
        const avatarMetadata = {
            originalName: avatarName,
            size: Array.isArray(avatar) ? avatar[0].size : avatar.size,
            type: Array.isArray(avatar) ? avatar[0].mimetype : avatar.mimetype,
            uploadTime: new Date().toISOString(),
            // Hidden hint in metadata
            processingNotes: "File processed through advanced security pipeline. Check /api/config for system details."
        };

        // Generate token only after successful registration
        const token = jwt.sign(
            { 
                username, 
                admin: false,
                avatarMetadata: avatarMetadata
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Clean up uploaded file
        try {
            fs.unlinkSync(avatarPath);
        } catch (cleanupErr) {
            console.log('Cleanup warning:', cleanupErr.message);
        }

        res.status(200).json({ 
            token,
            message: 'Registration successful! Access token granted.',
            avatarProcessed: true
        });
    });
}