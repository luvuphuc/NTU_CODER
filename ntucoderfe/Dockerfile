# Use an official Node.js runtime as the base image
FROM node:18 AS build
ENV NODE_OPTIONS=--max-old-space-size=4096
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
 
# Copy the rest of the application code
COPY . .
 
# Build the React app
RUN npm run build
 
# Use an Nginx image to serve the app
FROM nginx:alpine
 
# Copy the build folder from the previous stage to the Nginx container
COPY --from=build /app/build /usr/share/nginx/html
 
# Copy custom Nginx configuration
COPY ./default.conf /etc/nginx/conf.d/default.conf
 
# Expose the port Nginx is listening on
EXPOSE 80
 
# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]