# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . ./
RUN npm run build


# Stage 2: Production environment
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


#docker build -t calweb .
#docker run -p 80:80 calweb
#docker stop calweb

#docker build -t calweb --target build .
#docker run -p 3000:3000 calweb
