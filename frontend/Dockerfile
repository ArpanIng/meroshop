FROM node:20-bullseye-slim

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json /app/

# install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# export the port the apps runs on
EXPOSE 3000

CMD [ "npm", "run", "dev"]