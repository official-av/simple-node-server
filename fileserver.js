const http = require('http');
const url = require('url'); //node module to parse urls
const path = require('path'); //module for working with paths
const fs = require('fs'); // file system module
const hostname = '127.0.0.1';
const port = 3000;

//declared supported filetypes
const mimeTypes = {
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'js': 'text/javascript',
    'css': 'text/css'
};
//creating server
var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname; //parse req.url i.e url in request and extract pathname
    var fileName = path.join(process.cwd(), unescape(uri)); //join parsed url with current directory
    console.log('Loading' + uri);
    var stats;
    try {
        stats = fs.lstatSync(fileName); //checkif file exists and is loaded or not
    } catch (e) {
        res.writeHead(404, {
            'Content-type': 'text/plain'
        });
        res.write('404 Not Found');
        res.end();
        return;
    }

    if (stats.isFile()) {
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]]; //path.extname returns file's extension
        res.writeHead(200, {
            'Content-type': mimeType
        });
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {
            'Contet-type': 'text/plain'
        });
        res.write('500 Internal Error\n');
    }
});

server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}`);
});
