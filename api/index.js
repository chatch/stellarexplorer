const express = require('express');
const { rateLimit } = require('express-rate-limit');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path')

// Current maximum - see discussions in Discord
const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024

const WABT_BIN_PATH = `/wabt-1.0.33/bin`
const WASM_DECOMPILE_PATH = `${WABT_BIN_PATH}/wasm-decompile`
const WASM_2_WAT_PATH = `${WABT_BIN_PATH}/wasm2wat`

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: MAX_FILE_SIZE_BYTES }
});

const wabtToolRoute = (subpath, toolPath) => app.post(
    subpath,
    decompileLimiter,
    upload.single('contract'),
    (req, res) => {
        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }
        const filePath = path.join(req.file.destination, req.file.filename);
        const wasmFilePath = filePath + ".wasm";
        fs.renameSync(filePath, wasmFilePath);

        exec(`${toolPath} ${wasmFilePath}`, (error, stdout, stderr) => {
            fs.unlinkSync(wasmFilePath)
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).send(`Command execution error: ${error}`);
            }
            res.contentType('text/plain')
            res.send(stdout);
        });
    });

const decompileLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false
})

const app = express();

app.set('trust proxy', 2)

/** 
* Decompile a wasm file using the wabt wasm-decompile tool
* 
* To invoke from cli:
*   curl -F "contract=@/wasm/contract.wasm" http://localhost:3000/decompile
*/
wabtToolRoute(`/decompile`, WASM_DECOMPILE_PATH)

/**
* Convert wasm to wat using the wabt wasm2wat tool
* 
* To invoke from cli:
*   curl -F "contract=@/wasm/contract.wasm" http://localhost:3000/wat
*/
wabtToolRoute(`/wat`, WASM_2_WAT_PATH)

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});