import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const BASE_URL = process.env.BASE_URL;
const JWT_SECRET = process.env.JWT_SECRET

export {PORT, MONGO_URL, BASE_URL, JWT_SECRET}

