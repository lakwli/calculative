FROM python:3.12-slim

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Install curl for health checks and clean up
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Set permissions
RUN chown -R appuser:appuser /app

# Runtime settings
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Container resource limits (these are soft limits, hard limits set in deployment)
ENV MEMORY_LIMIT=512m
ENV CPU_LIMIT=1.0

EXPOSE ${PORT}

ENTRYPOINT ["python"]
CMD ["run.py"]
