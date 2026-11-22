# Dockerfile PROPIO del componente principal (la API).
# Imagen base oficial de Node 22 en su variante alpine: pequeña (~50 MB) y con
# soporte LTS. Trae "fetch" incorporado, que usa el script de la operación.
FROM node:22-alpine

WORKDIR /app

# Primero solo package*.json: así Docker reutiliza la capa de dependencias
# en caché si el código cambia pero las dependencias no (construye más rápido).
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY scripts ./scripts

# No correr como root dentro del contenedor (buena práctica de seguridad).
USER node

EXPOSE 3000
CMD ["node", "src/server.js"]
