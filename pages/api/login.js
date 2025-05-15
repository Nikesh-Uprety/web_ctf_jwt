import jwt from 'jsonwebtoken';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { username, password } = req.body;

    // Simple authentication for CTF purposes
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing credentials' });
    }

    const token = jwt.sign(
        { username, admin: false },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({ token });
}