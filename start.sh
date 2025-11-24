#!/bin/sh

# Create log directories
mkdir -p /var/log/nginx /var/log/backend /var/log/supervisor

# Run database migrations if needed
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running database migrations..."
  cd /app/backend
  npx prisma migrate deploy
fi

# Start supervisor (runs both nginx and backend)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf

