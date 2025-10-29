const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    const token = req.headers["x-token"];
    if (!token) {
        return res.status(401).json({
            message: "Acceso denegado, inicie sesion para continuar"
        })
    }

    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded; // aqui se guarda la info del usuario
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado" });
    }

}

module.exports=authMiddleware;