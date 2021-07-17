const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const authHeader = req.header("Authorization");
        if (authHeader) {
            const splitToken = authHeader.split("Bearer ");
            const token = splitToken[1];
            if (!token) {
                res.status(403).json({ error: "Forbidden Access" })
            }
            const decoded = jwt.verify(token, process.env.TOKEN)
            req.user = decoded.user
        }
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ error: "Invalid Token" })
    }
}