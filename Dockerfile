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

# Expose the port the app runs on
EXPOSE 3002

# Define the command to run the application
CMD ["node", "app/server.js"]
