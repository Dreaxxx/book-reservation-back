README — Back (NestJS + Prisma + PostgreSQL)
Prérequis

# Docker & Docker Compose

Configuration

Créez un fichier .env.docker.local (non commité) à la racine du dépôt back :

## App
```ts
NODE_ENV=production
PORT=3333
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=jwt
```

Créez un autre .env.pg.local (non commité non plus) à la racine d u déôt back : 

```ts
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=bookdb
```

### Prisma
`DATABASE_URL=postgresql://postgres:postgres@postgres:5432/bookdb?schema=public`

Note : dans Docker, on référence le service Postgres par son nom de service (postgres) et le port interne 5432.

Lancer avec Docker (API + Postgres)
`docker compose build`
`docker-compose up`

API accessible sur http://localhost:3333

Postgres mappé sur localhost:55432 en local sans docker ou 5432 depuis docker


# Sans docker

Node 18+ (22 optimal) si vous lancez en local

Configuration

Créez un fichier .env (non commité) à la racine du dépôt back :

## App
```ts
PORT=3333
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=jwt
DATABASE_URL=postgresql://postgres:postgres@localhost:55432/bookdb?schema=public
```

## Commandes

Vous pouvez executer la seed prisma en utilisant la commande : `npm run prisma:seed` qui fera un populate de la base de données avec des valeurs de bases et un utilisateur par défaut.

Executez un : `npm install` à la racine du projet puis simplement un : `npm run dev` pour lancer le backend. 

Vous pouvez executer les tests en utilisant les commandes : `npm run test` pour les tests uniqtaires et : `npm run test:e2e` pour les tests fonctionnels.
