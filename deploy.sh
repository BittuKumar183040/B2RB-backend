#!/usr/bin/env bash
set -e

APP_NAME="be2b-backend"
CONTAINER_NAME="b2rb-backend-container"
ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "❌ .env file not found"
  exit 1
fi

if [ -z "$PORT" ]; then
  echo "❌ PORT is not set in .env"
  exit 1
fi

echo "▶ Fetching latest code..."
git fetch origin
git pull origin main

echo "▶ Getting git commit hash..."
COMMIT_HASH=$(git rev-parse --short HEAD)

IMAGE_TAG="${APP_NAME}:${COMMIT_HASH}"

echo "▶ Building image: $IMAGE_TAG"
podman build -t "$IMAGE_TAG" -t "${APP_NAME}:latest" .

echo "▶ Stopping old container (if exists)..."
podman stop "$CONTAINER_NAME" 2>/dev/null || true
podman rm "$CONTAINER_NAME" 2>/dev/null || true

echo "▶ Running new container on port $PORT → 4991"
podman run -d --name "$CONTAINER_NAME" --network b2rb --restart=always --env-file "$ENV_FILE" -e ROOT_FOLDER=/data -v /data/windoes:/data:z -p "${PORT}:4991" "$IMAGE_TAG"

echo "▶ Cleaning old images..."
podman image prune -f

echo "✅ Deployment successful: $IMAGE_TAG"
