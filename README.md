
# Haikus for Codespaces

This is a quick Node.js project template for demoing Codespaces. It is based on the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world).

## Run locally

```bash
npm install
npm start
```

The app runs on `PORT` or defaults to `3000`.

## Run with Nginx + app containers

Build and run both services:

```bash
docker compose up --build
```

Then open:

- `http://localhost:8080` (through Nginx)

Stop services:

```bash
docker compose down
```
