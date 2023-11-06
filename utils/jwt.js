import jwt from 'jsonwebtoken';

export const jsontoken = (id) => {
    const token = jwt.sign({ _id: id }, process.env.JWT_KEY);
    return token;
}
