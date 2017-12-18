FROM node
WORKDIR /var/www
COPY . .
RUN npm install
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "run", "start"]
