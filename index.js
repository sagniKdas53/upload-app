const http = require('http');
const busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');
var port = process.argv[2] || 8888;
var index = fs.readFileSync(__dirname + '/index.html')
var response = fs.readFileSync(__dirname + '/response.html')

var server = http.createServer((req, res) => {
    let saved = '';
    let filename = '';
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(index);
        res.end();
    } else if (req.url === '/files') {
        file_size = req.headers['content-length'] / (1024 ^ 2);
        console.log("req.headers['content-length'] in MB: " + file_size / 1024);
        var total = 0;
        const bb = busboy({ headers: req.headers });
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar.start(100, 0);
        var io = require('socket.io')(server);
        io.on('connection', function (socket) {
            socket.emit('init', { message: "Connected", id: socket.id });

            //socket.on('acknowledge', console.log);  
            // remove this as this causes the progress bar to break
        });
        io.emit('progress', { progress: 0 });
        bb.on('file', (name, file, info) => {
            filename = decodeURIComponent(escape(info.filename));   //This is depricated but it's the easiet way to do it
            //process.stdout.write("Saving: " + filename + "\t");
            saved += "<br>" + filename
            const saveTo = fs.createWriteStream(path.join(__dirname + "/recieved", filename));
            if (!fs.existsSync(__dirname + "/recieved")) {
                fs.mkdirSync(__dirname + "/recieved", { recursive: true });
            }
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
                io.emit('progress', { progress: value });
                /* this is a temporary solution, find a way get the full file size
                then calculate the percentage and post that to the progress bar on 
                the client side also make it elegant*/
            }, 500);
            //save.addListener("progress", () => { console.log(save.bytesWritten / 1024) })
            //process.stdout.write('✅\n');
        });
        bb.on('close', () => {
            bar.update(100);
            io.emit('progress', { progress: 100 });
            bar.stop();
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(response + saved + '</div></div></body></html>');
            res.end();
        });
        req.pipe(bb);
    } else if (req.url === '/folder') {
        file_size = req.headers['content-length'] / (1024 ^ 2);
        console.log("req.headers['content-length'] in MB: " + file_size / 1024);
        var total = 0;
        const bb = busboy({ headers: req.headers, preservePath: true });
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar.start(100, 0);
        var io = require('socket.io')(server);
        io.on('connection', function (socket) {
            socket.emit('init', { message: "Connected", id: socket.id });

            //socket.on('acknowledge', console.log);
            // remove this as this causes the progress bar to break
        });
        io.emit('progress', { progress: 0 });
        bb.on('file', (name, file, info) => {
            filename = decodeURIComponent(escape(info.filename));   //This is depricated but it's the easiet way to do it
            //console.log(filename);
            dirpath = __dirname + "/recieved/"
            dirpath += filename.slice(0, filename.lastIndexOf('/'));
            //console.log(dirpath);
            if (!fs.existsSync(dirpath)) {
                fs.mkdirSync(dirpath, { recursive: true });
            }
            //process.stdout.write("Saving: " + filename.slice(filename.lastIndexOf('/') + 1,) + '\t');
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
                io.emit('progress', { progress: value });
                /* this is a temporary solution, find a way get the full file size
                then calculate the percentage and post that to the progress bar on 
                the client side also make it elegant*/
            }, 500);
            //save.addListener("progress", () => { console.log(save.bytesWritten / 1024) })
            //process.stdout.write('✅\n');
        });
        bb.on('close', () => {
            bar.update(100);
            io.emit('progress', { progress: 100 });
            bar.stop();
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(response + saved + '</div></div></body></html>');
            res.end();
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