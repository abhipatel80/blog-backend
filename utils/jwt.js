import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config('.env');

export const jsontoken = async (id) => {
    const token = jwt.sign({ _id: id }, process.env.JWT_KEY);
    return token;
}
