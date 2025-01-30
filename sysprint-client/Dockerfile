# Usar uma imagem base do Node.js
FROM node:lts

WORKDIR /app

# Definir variável de ambiente para modo de execução
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

EXPOSE 9000 9200

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm start; else npm run dev; fi"]
