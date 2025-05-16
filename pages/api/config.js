
export default function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

        res.status(200).json({
            secret: "UEdTX0YzUEUzR19YM0w =",
            message: "Nice finddd! Use this to sign admin JWTs"
        });
    } 

