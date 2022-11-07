const http = require('http');
const busboy = require('busboy');
const fs = require('fs');
const path = require('path');
var port = process.argv[2] || 8888;

const server = http.createServer((req, res) => {
    let saved = '';
    let filename = '';
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(fs.readFileSync(__dirname + '/index.html'));
        res.end();
    } else if (req.url === '/files') {
        const bb = busboy({ headers: req.headers });
        bb.on('file', (name, file, info) => {
            filename = info.filename;
            console.log("Saved: " + filename);
            saved += "," + filename
            const saveTo = path.join(__dirname + "/recieved", filename);
            file.pipe(fs.createWriteStream(saveTo));
        });
        bb.on('close', () => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`upload success: ${saved}`);
        });
        req.pipe(bb);
    } else if (req.url === '/folder') {
        const bb = busboy({ headers: req.headers, preservePath: true });
        bb.on('file', (name, file, info) => {
            filename = info.filename;
            console.log("Saved: " + filename);
            saved += "," + filename
            const saveTo = path.join(__dirname + "/recieved", filename);
            file.pipe(fs.createWriteStream(saveTo));
        });
        bb.on('close', () => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`upload success: ${saved}`);
        });
        req.pipe(bb);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404');
    }
});

server.listen(port, () => {
    console.log('Server listening on ' + port);
});
