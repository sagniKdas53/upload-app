const http = require('http');
const busboy = require('busboy');
const fs = require('fs');
const path = require('path');
var port = process.argv[2] || 8888;

const server = http.createServer((req, res) => {
    let saved = '';
    let filename = '';
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(fs.readFileSync(__dirname + '/index.html'));
        res.end();
    } else if (req.url === '/files') {
        const bb = busboy({ headers: req.headers });
        bb.on('file', (name, file, info) => {
            filename = decodeURIComponent(escape(info.filename));   //This is depricated but it's the easiet way to do it
            process.stdout.write("Saving: " + filename + "\t");
            saved += "<br>" + filename
            const saveTo = path.join(__dirname + "/recieved", filename);
            file.pipe(fs.createWriteStream(saveTo)); // the file is getting piped into fs to be saved
            process.stdout.write('✅\n');
        });
        bb.on('close', () => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<h3>Upload success:</h3> ${saved}`);
        });
        req.pipe(bb);
    } else if (req.url === '/folder') {
        const bb = busboy({ headers: req.headers, preservePath: true });
        bb.on('file', (name, file, info) => {
            filename = decodeURIComponent(escape(info.filename));
            dirpath = __dirname + "/recieved/"
            dirpath += filename.slice(0, filename.lastIndexOf('/'));
            //console.log(dirpath);
            if (!fs.existsSync(dirpath)) {
                fs.mkdirSync(dirpath, { recursive: true });
            }
            process.stdout.write("Saving: " + filename.slice(filename.lastIndexOf('/') + 1,) + '\t');
            saved += "<br>" + filename
            const saveTo = path.join(__dirname + "/recieved", filename);
            file.pipe(fs.createWriteStream(saveTo));
            process.stdout.write('✅\n');
        });
        bb.on('close', () => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<h3>Upload success:</h3> ${saved}`);
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
