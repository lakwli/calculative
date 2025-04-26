# Calculative Backend

A Flask-based backend service for financial calculations.

## Environment Configuration

This application requires environment configuration via a `.env` file.

### Setup Instructions

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```
   FLASK_ENV=development
   SECRET_KEY=your-secret-key
   CORS_ORIGINS=http://localhost:3000
   ```

### Docker Deployment

When using Docker, pass the environment variables using:

```bash
docker run -p 5000:5000 \
  --env-file .env \
  calc-backend-prod
```

Or in docker-compose.yml:
```yaml
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    env_file:
      - .env
```

### Required Environment Variables

- `FLASK_ENV`: Set to 'development' or 'production'
- `SECRET_KEY`: Required for security (set a strong value)
- `CORS_ORIGINS`: Comma-separated list of allowed frontend origins

### Optional Environment Variables

- `RATE_LIMIT`: API rate limiting (default: "100 per minute")

## Security Notes

- Never commit `.env` files containing real credentials
- Use strong, random values for `SECRET_KEY` in production
- Properly configure `CORS_ORIGINS` to prevent unauthorized access
