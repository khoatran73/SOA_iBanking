import dotenv from 'dotenv';
import express, { Application } from 'express';
import expressSession from 'express-session';
import http from 'http';
import route from './Controllers';
import { connectDatabase } from './db';
import cookieSession from 'cookie-session';

const MemoryStore = expressSession.MemoryStore;
const oneDay = 24 * 60 * 60;
dotenv.config();
const port: number = Number(process.env.PORT) || 5000;
const dbUrl: string | undefined = process.env.MONGO_URL_ATLAS;
const app: Application = express();
const server = http.createServer(app);

connectDatabase(dbUrl);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    cookieSession({
        secret: 'secret',
        // store: new MemoryStore(60 * 60 * 12),
        maxAge: oneDay,
        expires: new Date(Date.now() + oneDay),
    }),
);
// app.use(
//     expressSession({
//         store: new MemoryStore(),
//         secret: 'secret',
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             maxAge: 24 * 60 * 60 * 100,
//             expires: new Date(Date.now() + 24 * 60 * 60 * 100),
//             // sameSite: 'strict',
//             // httpOnly: false,
//             // secure: false,
//         },
//     }),
// );

route(app);

server.listen(port, () => {
    console.log('sever is running on port ' + port);
});
