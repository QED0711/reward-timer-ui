import fs from 'node:fs';
import express from 'express';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import { Server } from "socket.io";
import http from "node:http";
import https from 'node:https';
import routes from './routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const httpServer = express();
httpServer.all("*", (req, res) => {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
})
const app = express();

// CORS
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
app.options("*", cors(corsOptions))
app.use(cors(corsOptions))

// BASIC AUTH
let auth;
try {
    auth = fs.readFileSync(path.join(__dirname, "auth.json"), "utf8");
    auth = JSON.parse(auth);
} catch (err) {/* auth remains undefined */ }
if(process.env.BASIC_AUTH === "true" && auth) {
    app.use(basicAuth({ users: auth.users, challenge: true, realm: auth.realm ?? "realm" }));
}


// SERVE STATIC
app.use("/", express.static(path.join(__dirname, "..", "dist")))

// ENABLE SSL
const privateKey = fs.readFileSync(path.join(__dirname, "..", "ssl", "server.key"), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, "..", "ssl", "server.cert"), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);
export const io = new Server(server, { cors: corsOptions });

// API Key Verification
app.use(function(req, res, next){
    const apiKey = req.headers["x-api-key"];
    if("apiKeys" in auth && (!apiKey || !auth.apiKeys?.includes?.(apiKey))){
        res.status(401)
        return res.json({"apiKeyError": "API Key missing or no found match"})
    }
    next();
})
for (let route of routes) {
    app[route.method]?.(route.path, bodyParser.json(), route.callback)
}

io.on('connection', socket => {
    console.log("=== NEW CONNECTION ===");
    // io.to(socket.id).emit("serverTime", {time: Date.now()})
    io.emit("serverTime", { time: Date.now(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
})

// START SERVER(S)
const HTTP_PORT = 8000
const HTTPS_PORT = 8443

httpServer.listen(HTTP_PORT, () => console.log(`Redirecting from http://localhost:${HTTP_PORT}`))
server.listen(HTTPS_PORT, () => console.log(`Serving at https://localhost:${HTTPS_PORT}/`))
