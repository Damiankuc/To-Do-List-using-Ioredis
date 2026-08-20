FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos del frontend
COPY public /usr/share/nginx/html

# Exponer los dos puertos configurados para la app
EXPOSE 3001 3002

CMD ["nginx", "-g", "daemon off;"]
