import jwt from 'jsonwebtoken';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Parse form data for consistency with register endpoint
    const username = req.body.username || (req.body.get && req.body.get('username'));
    const password = req.body.password || (req.body.get && req.body.get('password'));

    // Simple authentication for CTF purposes
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing credentials' });
    }

    // Login successful but no token issued - must register to get token
    res.status(200).json({ 
        message: 'Login successful! Please register to receive an access token.',
        username: username
    });
}