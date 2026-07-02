import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

    if (!token) {
        return res.status(401).json({ success: false, data: "Token not included." })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })

        req.user = {
            id: decoded.id
        }

        next()
    } catch (err) {
        const message = err.name === 'TokenExpiredError'
            ? 'Expired token.'
            : 'Invalid token.'
        return res.status(403).json({ success: false, data: message })
    }
}

export default authMiddleware