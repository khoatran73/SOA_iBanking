import dotenv from 'dotenv';
import express, { Application } from 'express';
import expressSession from 'express-session';
import http from 'http';
import route from './Controllers';
import { connectDatabase } from './db';
const MemoryStore = expressSession.MemoryStore;
const oneDay = 24 * 60 * 60 * 1000;

dotenv.config();
const port: number = Number(process.env.PORT) || 5000;
const dbUrl: string | undefined = process.env.MONGO_URL_LOCAL ?? process.env.MONGO_URL_ATLAS;
const app: Application = express();
const server = http.createServer(app);

connectDatabase(dbUrl);

app.use(express.urlencoded({ extended: true }));

app.use(
    expressSession({
        store: new MemoryStore(),
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: oneDay,
            sameSite: 'strict',
            httpOnly: false,
            secure: false,
        },
    }),
);
app.use(express.json());

route(app);

server.listen(port, () => {
    console.log('sever is running on port ' + port);
});
