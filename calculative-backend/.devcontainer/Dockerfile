FROM python:3.9-slim

WORKDIR /app

# Development tools and dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for development
RUN useradd -m -s /bin/bash vscode \
    && chown -R vscode:vscode /app

# Don't install requirements here - let devcontainer.json handle it
# Don't copy application code - will be mounted by devcontainer.json

USER vscode

# No CMD - devcontainer.json handles this