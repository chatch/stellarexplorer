const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024
const WASM_DECOMPILE_PATH = `/wabt-1.0.33/bin/wasm-decompile`

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: MAX_FILE_SIZE_BYTES }
});

const app = express();

/**
 * Decompile a wasm file using the wabt wasm-decompile tool
 * 
 * To invoke from cli:
 *   curl -F "contract=@/wasm/contract.wasm" http://localhost:3000/decompile
 */
app.post('/decompile', upload.single('contract'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }
    const filePath = path.join(req.file.destination, req.file.filename);
    const wasmFilePath = filePath + ".wasm";
    fs.renameSync(filePath, wasmFilePath);

    exec(`${WASM_DECOMPILE_PATH} ${wasmFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(wasmFilePath)
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Command execution error: ${error}`);
        }
        res.contentType('text/plain')
        res.send(stdout);
    });
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});