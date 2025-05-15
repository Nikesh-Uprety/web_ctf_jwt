import jwt from 'jsonwebtoken';

export default function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.admin) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        res.status(200).json({
            message: 'Welcome admin!',
            flag: process.env.FLAG || 'CTF{test_flag}'
        });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
}