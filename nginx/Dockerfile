FROM nginx:alpine

# Copiar plantilla de Nginx para procesamiento dinámico de variables de entorno (envsubst)
COPY nginx/nginx.conf.template /etc/nginx/templates/default.conf.template

# Copiar archivos estáticos del frontend
COPY public /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
