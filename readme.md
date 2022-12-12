# Upload server

Very simple http-server to upload and view files and folders to the host

## TODO

- [x] Add unicode support
- [x] Add a progress bar
  - [x] Progress bar uses socket io so some edges needed to be cut but it works
- [x] Use a tiny css framework
- [x] Can't upload big files, needs more testing
  - [x] It depends on the network and not the server
- [x] Add a way to browse the servers recieved directory
  - [x] httpd with docker did the job
- [ ] Add the Apaxy theme to the build process
  - [x] [Apaxy git](https://github.com/oupala/apaxy)
  - [ ] Make a way to clone the files into the container directly and use only the needed files
- [ ] Make a npm package so that i can install it on more platforms
- [x] Make a docker hub image and publish it
- [ ] Make a docker hub image for raspberry pi (on a git branch) and publish it
