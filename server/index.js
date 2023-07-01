import express from 'express';
import bodyParser from 'body-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import { Server } from "socket.io";
import http from 'node:http';
import routes from './routes.js'

const app = express();
app.options("*", cors())
app.use(cors())
app.use("/", express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist")))

const server = http.createServer(app);
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
    // io.emit("test", { message: "Hello world" })
    console.log("CONNECTION")
})


const port = 8000
server.listen(port, () => {
    console.log(`Serving at http://localhost:${port}/`);
})
