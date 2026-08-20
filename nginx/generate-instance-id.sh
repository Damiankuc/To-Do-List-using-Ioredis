#!/bin/sh
# Generar un ID de 4 dígitos usando /dev/urandom para garantizar unicidad absoluta entre contenedores
if [ -z "$APP_INSTANCE" ] || [ "$APP_INSTANCE" = "auto" ]; then
    RAND_ID=$(tr -dc '1-9' < /dev/urandom | head -c 4)
    APP_INSTANCE="Instancia #$RAND_ID"
fi

# Escribir el archivo instance.json para que Nginx lo sirva directamente en /instance
cat <<EOF > /usr/share/nginx/html/instance.json
{
  "instance": "$APP_INSTANCE"
}
EOF
