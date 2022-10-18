import express, { Application } from 'express';
import http from 'http';
import route from './Controllers';
import { connectDatabase } from './db';
import dotenv from 'dotenv';

dotenv.config();
const port: number = Number(process.env.PORT) || 5000;
const dbUrl: string | undefined = process.env.MONGO_URL_ATLAT;
const app: Application = express();
const server = http.createServer(app);
connectDatabase(dbUrl);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

server.listen(port, () => {
    console.log('sever is running on port ' + port);
});
