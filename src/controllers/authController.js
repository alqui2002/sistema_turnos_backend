import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js'; // Adjust the import path as necessary
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = 10;

// POST /auth/register
export async function register(req, res) {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ email, password: hash });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error en registro', error: err.message });
  }
}

// POST /auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en login', error: err.message });
  }
}
