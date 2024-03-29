
const express = require('express')
const { rateLimit } = require('express-rate-limit')
const { createRequestHandler } = require('@remix-run/express')
const serverBuild = require('./build/index')

const app = express()

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
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`request ip: ${ip}`);
    next();
});

app.use(express.static("public"));


// ... set up any middleware, like rateLimit, here

app.all(
    '*',
    createRequestHandler({
        build: serverBuild,
        getLoadContext() {
            // Your context here
        },
    })
)

const port = process.env.PORT ?? 3000

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
})
