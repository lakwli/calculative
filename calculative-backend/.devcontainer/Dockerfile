FROM python:3.12-slim

WORKDIR /app

# Development tools and dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    vim \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Update pip and install packages globally
RUN python -m pip install --upgrade pip

# Create non-root user for development
RUN useradd -m -s /bin/bash vscode \
    && chown -R vscode:vscode /app

# Prevent Python from generating bytecode files
ENV PYTHONDONTWRITEBYTECODE=1

USER vscode
