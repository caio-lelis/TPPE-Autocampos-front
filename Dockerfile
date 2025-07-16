# Estágio 1: Build da aplicação React
FROM node:18-alpine AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e package-lock.json para o diretório de trabalho
# Isso aproveita o cache do Docker. A instalação só roda de novo se estes arquivos mudarem.
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install
RUN npm install react-router-dom
RUN npm install react-icons
# Copia todo o resto do código-fonte para o diretório de trabalho
COPY . .

# Executa o build da aplicação
RUN npm run build

# Estágio 2: Servir a aplicação com Nginx
FROM nginx:stable-alpine

# Copia os arquivos estáticos gerados no estágio de build para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (porta padrão do Nginx)
EXPOSE 80

# Comando para iniciar o Nginx quando o contêiner for executado
CMD ["nginx", "-g", "daemon off;"]
