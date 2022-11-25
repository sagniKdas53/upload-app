# Upload server

Very simple http-server to upload files and folders to the host

## TODO

- [x] Add unicode support
- [x] Add a progress bar
  - [x] Progress bar uses socket io so some edges needed to be cut but it works
- [x] Use a tiny css framework
- [x] Can't upload big files, needs more testing
  - [x] It depends on the network and not the server
- [ ] Add a way to browse the servers recieved directory
  - [x] Express won't work, need a way to browse the files not just host them
  - [ ] Maybe <https://www.npmjs.com/package/cloudcmd> can be used
  - [ ] <https://github.com/serverwentdown/file-manager>
  - [ ] <https://chonky.io/>
  - [ ] <https://github.com/sumitchawla/file-browser>
  - [ ] <https://chawlasumit.wordpress.com/2014/08/04/how-to-create-a-web-based-file-browser-using-nodejs-express-and-jquery-datatables/>
  - [ ] <https://npm.io/search/keyword:file+explorer>
  - [ ] <https://github.com/ianaya89/node-explorer>
  - [ ] <https://github.com/marvinjude/xplora>

- [ ] Make a npm package so that i can install it on more platforms
