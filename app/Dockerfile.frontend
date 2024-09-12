# FROM node:18-alpine3.20 AS build
# WORKDIR /app
# COPY package.json package.json
# RUN yarn install
# COPY . .
# RUN yarn build

# FROM nginx:1.19-alpine
# COPY --from=build /app/dist /opt/site
# COPY nginx.conf /etc/nginx/nginx.conf

# We don't want to start from scratch.
# That is why we tell node here to use the current node image as base.
FROM node:18-alpine3.20

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm install

# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY . .

# Build the app
# RUN npm run build

# Start the app
CMD ["npm", "run", "dev"]
# "npm", "start" ]