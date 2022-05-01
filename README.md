# Next.js TesloShop App
Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```

* El -d, significa __detached__

MongoDB URL Local:
```
mongodb://localhost:27017/entriesdb
```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__

## llamar la base de datos con informacion de pruebas
llamar a:
```
localhost:3000/api/seed
```

## Para generar el JWT use el siguiente comando:
use el siguiente comando:
```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```