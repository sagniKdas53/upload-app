# Note

This is just a backup of the the essential apaxy files as they were when i made the project.
The docker file for apaxy builds it from the github directly so unless it stops working there is
no need to do anything.

If it does though then use this docker file instead.

## Change the docker-compose as

````docker-compose
apache-apaxy-server:
  image: apaxy
  build:
    context: ./apaxy-essentials/
    args:
      apaxyPath: ''
  ports:
    - '8080:8080' #host:container
  volumes:
    - './recieved/:/usr/local/apache2/htdocs/recieved'
````
