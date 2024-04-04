# Use an official Node runtime as the base image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory /app in the container
COPY package*.json ./

# Install project dependencies in the container
RUN npm install

# Copy the current directory contents (i.e., your project files) into the directory /app in the container
COPY . .

#Build the application
RUN npm run build

# Make port 3000 available to the world outside the container
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "start" ]