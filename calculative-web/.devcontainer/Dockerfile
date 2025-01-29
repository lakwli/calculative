FROM node:18-alpine

WORKDIR /workspace

# Add necessary tools for VS Code and development
RUN apk add --no-cache \
    git \
    bash


RUN adduser -D -h /home/vscode -s /bin/bash vscode \
    && chown -R vscode:vscode /workspace

USER vscode

EXPOSE 3000

#docker container prune
#docker image prune
#docker system prune --all
#docker system prune -a --volumes

#docker volume prune
#docker builder prune

