# ==============================================================================
# Production Dockerfile for PinkSalt Intelligence & Investment Portal
# ==============================================================================

FROM python:3.9-slim

WORKDIR /app

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Copy application files
COPY . /app

# Run internal tests during container build to guarantee release integrity
RUN python test_portal.py && python test_handler.py

EXPOSE 8080

CMD ["python", "server.py"]
