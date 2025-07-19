
export default function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

        res.status(200).json({
            secret: "TkNBX0BETUlOX1MzQ1JFVF9LM1k=",
            message: "Nice find! Now you know what to do!"
        });
    } 

