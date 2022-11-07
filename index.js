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
            res.end(`upload success: ${saved.slice(1)}`);
        });
        req.pipe(bb);
    } else if (req.url === '/folder') {
        const bb = busboy({ headers: req.headers, preservePath: true });
        bb.on('file', (name, file, info) => {
            filename = info.filename;
            dirpath = __dirname + "/recieved/"
            dirpath += filename.slice(0, filename.lastIndexOf('/'));
            //console.log(dirpath);
            if (!fs.existsSync(dirpath)) {
                fs.mkdirSync(dirpath, { recursive: true });
            }
            //decodeURIComponent(escape(magles))  This is depricated but it's the easiet way to do it
            console.log("Saved: " + filename.slice(filename.lastIndexOf('/') + 1,));
            saved += "," + filename
            const saveTo = path.join(__dirname + "/recieved", filename);
            file.pipe(fs.createWriteStream(saveTo));
        });
        bb.on('close', () => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`upload success: ${saved.slice(1)}`);
        });
        req.pipe(bb);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404');
    }
});

server.listen(port, () => {
    console.log('Server listening on http://localhost:' + port);
});
