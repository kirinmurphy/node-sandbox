# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dependencies inside the container
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Copy wait-for-it script to the container
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expose the port the app runs on
EXPOSE 3002

# Define the command to run the application, waiting for MySQL to be ready
CMD ["/wait-for-it.sh", "mysql:3306", "--", "node", "app/server.js"]
