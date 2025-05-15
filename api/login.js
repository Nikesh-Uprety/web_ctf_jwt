import { sign } from 'jsonwebtoken';

export default (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();

    const { username, password } = req.body;

    // Very basic "authentication" for CTF purposes
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing credentials' });
    }

    const token = sign(
        {
            username,
            admin: false  // Notice this is hardcoded to false
        },
        'CTF_S3CR3T_K3Y',
        { expiresIn: '1h' }
    );

    res.status(200).json({ token });
};