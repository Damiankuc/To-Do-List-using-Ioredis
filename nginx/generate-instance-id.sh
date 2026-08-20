#!/bin/sh
# Si APP_INSTANCE no está definida o es "auto", generar un número aleatorio único de 4 dígitos (ej: Instancia #4829)
if [ -z "$APP_INSTANCE" ] || [ "$APP_INSTANCE" = "auto" ]; then
    RAND_ID=$(awk 'BEGIN{srand(); print int(1000+rand()*9000)}')
    export APP_INSTANCE="Instancia #$RAND_ID"
fi
