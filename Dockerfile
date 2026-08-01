FROM node:22-alpine

WORKDIR /app

# Copiamos solo los archivos de dependencias para usar la caché de Docker
COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

EXPOSE 5173

# Usamos modo "dev" para tener Hot Reload (recarga de código en tiempo real)
CMD ["npm", "run", "dev"]