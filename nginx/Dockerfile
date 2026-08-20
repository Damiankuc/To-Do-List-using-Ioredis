FROM nginx:alpine

# Copiar script para generación de instance.json dinámico al arrancar
COPY nginx/generate-instance-id.sh /docker-entrypoint.d/15-generate-instance-id.sh
RUN chmod +x /docker-entrypoint.d/15-generate-instance-id.sh

# Copiar configuración de Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos del frontend
COPY public /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
