FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Production settings
# PENV FLASK_ENV=production
# PENV PYTHONUNBUFFERED=1

ENTRYPOINT ["python"]
CMD ["app/app.py"]