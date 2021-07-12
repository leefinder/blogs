``` Dockerfile
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```setup.sh
image_version=`date +%Y%m%d%H%M`;
echo $image_version;
# cd vue2docker
git pull --rebase origin master;
docker stop vue2docker;
docker rm vue2docker;
docker build -t vue2docker:$image_version .;
docker images;
docker run -p 10003:80 -d --name vue2docker vue2docker:$image_version;
# -v ~/docker-data/house-web/appsettings.json:/app/appsettings.json -v ~/docker-data/house-web/NLogFile/:/app/NLogFile   --restart=always
docker logs vue2docker;
#É¾³ýbuild¹ý³ÌÖÐ²úÉúµÄ¾µÏñ    #docker image prune -a -f
docker rmi $(docker images -f "dangling=true" -q)
```
