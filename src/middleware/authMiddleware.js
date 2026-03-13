import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) { return res.status(401).json({ 
        success: false, 
        data: "Token não especificado." 
    })}

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            const message = err.name === 'TokenExpiredError'
                ? 'Token expirado.'
                : 'Token inválido.'
            return res.status(403).json({ 
                success: false, 
                data: message 
            })
        }

        const dados = {
            userId: decoded.id,
            nome: decoded.nome,
            email: decoded.email
        }

        req.dados = dados
        next()
    })
}

export default authMiddleware