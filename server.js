
const express = require('express')
const { rateLimit } = require('express-rate-limit')
const { createRequestHandler } = require('@remix-run/express')
const serverBuild = require('./build/index')

const app = express()

app.set('trust proxy', true);

// Fly.io proxy is compressing so we don't need here at the app level:

// app.use(compression());

// limit the bots that are hitting this at a fast rate
const limiter = rateLimit({
    windowMs: 8 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})
app.use('/account/*', limiter);

app.use((req, res, next) => {
    res.on('finish', () => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const path = req.originalUrl || req.url;

        const log = `${ip} - - [${new Date().toISOString()}] "${req.method} ${path} HTTP/${req.httpVersion}" ${res.statusCode} ${res.get('Content-Length') || 0} "-" "${req.headers['user-agent']}"`;
        console.log(log);
    });
    next();
});

app.use(express.static("public"));

app.all(
    '*',
    createRequestHandler({
        build: serverBuild,
        getLoadContext() {
        },
    })
)

const port = process.env.PORT ?? 3000
const host = '0.0.0.0'

app.listen(port, host, () => {
    console.log(`Express server listening on port ${port}`)
})
