import mysql from 'mysql2/promise';
import express from 'express';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());  // Enable CORS for all routes

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;
const PORT = process.env.PORT || 3333;

async function createConnection() {
  return await mysql.createConnection({
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    ssl: {
        ca: fs.readFileSync("./singlestore_bundle.pem"),
    }
  });
}

// API endpoint to fetch data from SingleStore
app.get('/api/albums', async (req, res) => {
  let connection;
  try {
    connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM album_calendar'); // Example query
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
