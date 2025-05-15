import { sign } from 'jsonwebtoken';

export default (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();

    const { username, password } = req.body;

    // In a real app, you'd store this in a database
    // For CTF, we'll just return a JWT directly
    const token = sign(
        {
            username,
            admin: false  // Regular users are not admins
        },
        'CTF_S3CR3T_K3Y',  // Weak secret for CTF
        { expiresIn: '1h' }
    );

    res.status(200).json({ token });
};