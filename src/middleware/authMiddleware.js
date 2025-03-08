import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    console.log(token);
    
    if (!token) return res.status(401).json({ error: 'Token missing' });

    const jwtToken = token.split(' ')[1];

    if (!jwtToken) {
        return res.status(401).json({ error: 'Invalid token format' });
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        req.user = decoded; 
        next();
    });
};


export default authMiddleware;
