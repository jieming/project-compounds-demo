FROM python:3.14-slim

# Install uv
RUN pip install uv

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync

# Copy Django application code
COPY . .

# Expose port
EXPOSE 8000

# Create startup script in a location that won't be overwritten by volume mount
RUN echo '#!/bin/bash\n\
cd /app/project_compound_api\n\
uv run python manage.py migrate\n\
uv run python manage.py runserver 0.0.0.0:8000' > /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

# Run migrations and start server
CMD ["/usr/local/bin/start.sh"]

