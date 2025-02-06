# Use the latest Node.js image
FROM node:latest

# Define variables
ARG USERNAME=vscode
ARG USER_UID=1002
ARG USER_GID=$USER_UID

# Install necessary packages
RUN apt-get update && apt-get install -y \
    git \
    bash \
    sudo

# Create the user and group
RUN groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd --uid ${USER_UID} --gid ${USER_GID} -m -s /bin/bash ${USERNAME} \
    && echo "${USERNAME} ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME}

# Install Node.js and npm (already present in node:latest)
# Setup npm global directory for the user
RUN mkdir -p /home/${USERNAME}/.npm-global \
    && chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}/.npm-global \
    && npm config -g set prefix '/home/${USERNAME}/.npm-global'

# Create .vscode-server directory and set permissions
RUN mkdir -p /home/${USERNAME}/.vscode-server \
    && chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}/.vscode-server

# Create workspace directory and set permissions
RUN mkdir -p /workspace \
    && chown -R ${USERNAME}:${USERNAME} /workspace

# Ensure the vscode user's home directory is owned by them
RUN chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}

# Set the default user
USER ${USERNAME}
