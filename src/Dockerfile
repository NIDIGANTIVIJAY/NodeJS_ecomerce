FROM  ghcr.io/puppeteer/puppeteer:21.1.1 
 ENV PUPPETEER_SKIP_DOWNLOAD true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable


# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3003

# Command to run your application
CMD ["node", "src/index.js"]
