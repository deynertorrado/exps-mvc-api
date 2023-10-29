// Módulos de funcionamiento
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Cargamos las variables de ambiente
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY;

// Creamos el JWT en base al "username"
const createJWTToken = (username) => {
    const token = Jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return token;
}

// Verificar el JWT
const verifyJWT = (req, res, next) => {
    const token = req.headers["authorization"];

    // Validamos la existencia del JWT
    if (!token) {
        return res.status(401).json({ message: "Acceso no autorizado" });
    }
    Jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado"})
        } else {
            // Si el token es válido, el usuario está autenticado
            next();
        }
    })
}

export { createJWTToken, verifyJWT };