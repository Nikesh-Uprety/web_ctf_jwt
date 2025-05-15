import { verify } from 'jsonwebtoken';

export default (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verify(token, 'CTF_S3CR3T_K3Y');

        if (!decoded.admin) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Success - return the flag
        res.status(200).json({
            message: 'Welcome admin!',
            flag: process.env.FLAG || 'CTF{FAKE_FLAG_FOR_TESTING}'
        });

    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};