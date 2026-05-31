# Glucose Tracker

## Docker local

```bash
cp .env.example .env
docker compose up -d --build
```

La app queda en `http://localhost:5173`.

Para ver el estado:

```bash
docker compose ps
```

Para parar:

```bash
docker compose down
```

## Despliegue remoto

1. Copia el proyecto al servidor.
2. Crea un `.env` desde `.env.example` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Levanta los servicios:

```bash
docker compose up -d --build
```
