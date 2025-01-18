# pull official base image
FROM python:3.12-slim-bullseye

# set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
	# prevents python creating .pyc files
	PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# install package
RUN pip install --no-cache-dir poetry

# copy poetry.lock and pyproject.toml
COPY poetry.lock pyproject.toml /app/

# install dependencies
RUN poetry install

# Copy the rest of the application code
COPY . .

# export the port the apps runs on
EXPOSE 8000
