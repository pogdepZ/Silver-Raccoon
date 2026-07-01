# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy dependencies list and install
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code and compile
COPY frontend/ ./
RUN npm run build

# Stage 2: Create the final Python production runtime
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY src/ src/
COPY main.py .

# Copy the compiled React assets from Stage 1
COPY --from=frontend-builder /app/frontend/dist/ /app/frontend/dist/

# Create data directory
RUN mkdir -p /app/data

# Run application
CMD ["python", "main.py"]
