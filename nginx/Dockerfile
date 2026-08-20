FROM nginx:alpine

# Copiar script para generación de número aleatorio único por contenedor en el punto de entrada de Nginx
COPY nginx/generate-instance-id.sh /docker-entrypoint.d/15-generate-instance-id.sh
RUN chmod +x /docker-entrypoint.d/15-generate-instance-id.sh

# Copiar plantilla de Nginx para procesamiento dinámico de variables de entorno (envsubst)
COPY nginx/nginx.conf.template /etc/nginx/templates/default.conf.template

# Copiar archivos estáticos del frontend
COPY public /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
