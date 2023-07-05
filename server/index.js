import fs from 'node:fs';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import { Server } from "socket.io";
import https from 'node:https';
import routes from './routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.options("*", cors())
app.use(cors())
app.use("/", express.static(path.join(__dirname, "..", "dist")))

const privateKey = fs.readFileSync(path.join(__dirname, "..", "ssl", "server.key"), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, "..", "ssl", "server.cert"), 'utf8');

const credentials = { key: privateKey, cert: certificate};

const server = https.createServer(credentials, app);
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    }
});


for (let route of routes) {
    app[route.method]?.(route.path, bodyParser.json(), route.callback)
}

io.on('connection', socket => {
    console.log("=== NEW CONNECTION ===");
    // io.to(socket.id).emit("serverTime", {time: Date.now()})
    io.emit("serverTime", {time: Date.now(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone});
})





const port = 8000
server.listen(port, () => {
    console.log(`Serving at http://localhost:${port}/`);
})
