
import express from 'express';
import path from 'path';
import env from 'dotenv';

env.config();

const port = process.env.PORT;
const app = express();

const __dirname = path.resolve();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

console.log(port + " ");
app.listen(port);