import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const BASE_URL = process.env.BASE_URL

export {PORT, MONGO_URL, BASE_URL}

