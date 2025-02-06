# Use the latest Node.js image
FROM node:latest

# Add necessary tools for development
RUN apt-get update && apt-get install -y \
    git \
    bash \
    sudo

# Create the user and group
RUN groupadd -r vscode && useradd -r -g vscode -m -s /bin/bash vscode && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/nopasswd

# Create home directory for the vscode user and set permissions
RUN mkdir -p /home/vscode && chown -R vscode:vscode /home/vscode

# Create workspace directory and set permissions
RUN mkdir -p /workspace && chown -R vscode:vscode /workspace

# Switch to the vscode user
USER vscode





#docker container prune
#docker image prune
#docker system prune --all
#docker system prune -a --volumes

#docker volume prune
#docker builder prune

