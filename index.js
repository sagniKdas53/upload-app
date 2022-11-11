const http = require('http');
const busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');
const io = require('socket.io')(http);
var port = process.argv[2] || 8888;

const server = http.createServer((req, res) => {
    let saved = '';
    let filename = '';
    //console.log(req, res);
    io.on('connection', function (socket) {
        console.log('CONNECTED');
        socket.join('sessionId');
    });
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(fs.readFileSync(__dirname + '/index.html'));
        res.end();
    } else if (req.url === '/files') {
        file_size = req.headers['content-length'] / (1024 ^ 2);
        console.log("req.headers['content-length'] in MB: " + file_size / 1024);
        var total = 0;
        const bb = busboy({ headers: req.headers });
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar.start(100, 0);
        bb.on('file', (name, file, info) => {
            filename = decodeURIComponent(escape(info.filename));   //This is depricated but it's the easiet way to do it
            //process.stdout.write("Saving: " + filename + "\t");
            saved += "<br>" + filename
            const saveTo = fs.createWriteStream(path.join(__dirname + "/recieved", filename));
            let save = file.pipe(saveTo); // the file is getting piped into fs to be saved
            var hold = 0;
            var value = 0;
            var progress = setInterval(function () {
                var wb = save.bytesWritten;
                if (hold != wb) {
                    total += save.bytesWritten - hold;
                    hold = wb;
                } else {
                    clearInterval(progress);
                    hold = 0;
                }
                //console.dir("Current file written in KB: " + wb / (1024 ^ 2))
                //console.dir("Total written in: " + ((total / (1024 ^ 2)) / file_size) * 100);
                value = Math.ceil((((total / (1024 ^ 2)) / file_size) * 100))
                bar.update(value);
                /* this is a temporary solution, find a way get the full file size
                then calculate the percentage and post that to the progress bar on 
                the client side also make it elegant*/
            }, 500);
            //save.addListener("progress", () => { console.log(save.bytesWritten / 1024) })
            //process.stdout.write('✅\n');
        });
        bb.on('close', () => {
            bar.update(100);
            bar.stop();
            //console.log('Saved: ', saved);
            //res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            //res.end(`<h3>Upload success:</h3> ${saved}`);
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
