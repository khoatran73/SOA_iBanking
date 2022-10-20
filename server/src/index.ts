import express, { Application } from 'express';
import http from 'http';
import route from './Controllers';
import { connectDatabase } from './db';
import dotenv from 'dotenv';
import expressSession from 'express-session';
const MemoryStore = expressSession.MemoryStore;


dotenv.config();
const port: number = Number(process.env.PORT) || 5000;
const dbUrl: string | undefined = process.env.MONGO_URL_ATLAT;
const app: Application = express();
const server = http.createServer(app);

connectDatabase(dbUrl);

app.use(express.urlencoded({ extended: true }));

app.use( expressSession({ 
    store: new MemoryStore(),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge : 24*60*60*100,
        sameSite: 'strict',
        httpOnly: false,
        secure: false
    }
}))
app.use(express.json());

route(app);

server.listen(port, () => {
    console.log('sever is running on port ' + port);
});
