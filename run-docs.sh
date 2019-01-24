#!/bin/sh
echo 'build static resources'
npm run doc:build
# kill old container
if docker ps | grep -i taroco-docs
    then
        echo 'kill old container'
        docker kill taroco-docs
fi

# remove old container
if docker ps -a | grep -i taroco-docs
    then
        echo 'rm old container'
        docker rm taroco-docs
fi

# remove old images
if docker images | grep docker_taroco-docs:latest
    then
        echo 'remove old image'
        docker rmi docker_taroco-docs:latest
fi

echo 'build image'
docker build --rm -t docker_taroco-docs:latest .
echo 'run docker container'
docker run -p 8080:80 --name taroco-docs -d docker_taroco-docs:latest