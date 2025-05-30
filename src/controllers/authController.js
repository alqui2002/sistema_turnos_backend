import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.js'; 
dotenv.config();

const SALT_ROUNDS = 10;

export async function register(req, res) {
  try {
    const { email, password, first_name,last_name, role } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ email, password: hash, first_name, last_name, role });
    res.status(201).json({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error en registro', error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en login', error: err.message });
  }
}
