// src/middlewares/validarJWT.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function validarJWT(req, res, next) {
  // 1. Leemos la cabecera Authorization
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó token' });
  }

  // 2. Debe tener formato "Bearer <token>"
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  // 3. Verificamos con jwt.verify()
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload = { id: <userId>, role: <userRole>, iat:…, exp:… }
    // Guardamos en req.user para que los controladores puedan leerlo:
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
