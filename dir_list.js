#!/usr/bin/env node

var fs = require("fs"),
    path = require("path");

var p = "recieved/"
fs.readdir(p, function (err, files) {
    if (err) {
        throw err;
    }

    files.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isFile();
    }).forEach(function (file) {
        console.log("%s (%s)", file, path.extname(file));
    });

    files.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isDirectory();
    }).forEach(function (file) {
        console.log("%s (%s)", file, "Folder");
    });
});

//From http://nodeexamples.com/2012/09/28/getting-a-directory-listing-using-the-fs-module-in-node-js/

//The previous example grabs a directory listing of the Node.js script’s parent directory (../) using the asynchronous fs.readdir() method. If no errors were encountered, the event object’s files property will contain an array of file and folder names for the specified directory.

//Next, we use the Array.map() method to join the directory name and the current file name using the Node.js path.join() method.

//Then we use the Array.filter() method to filter out only the files using the fs module’s statSync() method and the fs.Stats class’ isFile() method.

//Finally, we use the Array.forEach() method to iterate over each non-filtered item in the files array and display the filename and extension (using the path.extname() method).

//We could also easily use the Array.filter() method to filter the file array by the file extension if we only wanted to interate over .js/.json files or .png files, or instead we could use the fs.stats class’ isDirectory() method to recursively get the nested directory structure.

/*
This works but not in the way I need it.

const dirTree = require("directory-tree");

const tree = dirTree('./recieved/');
console.log(tree);*/