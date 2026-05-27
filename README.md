# Facteur Backoffice

Frontend del backoffice de Facteur (WP3). Fork de
[`newtralmedia/backoffice-factcricis-svc`](https://bitbucket.org/newtralmedia/backoffice-factcricis-svc),
en proceso de rediseño con la maqueta propia en `public/maqueta/`.

## Estado actual

- Plumbing (Next.js + auth + servicios) heredado del backoffice original — sigue funcionando contra la API local de Facteur en `http://localhost:3000`.
- UI heredada (Antd) intacta de momento. Se reemplazará página a página por la versión de la maqueta.
- Maqueta de referencia (HTML/CSS/JS plano) disponible en `public/maqueta/` — no se sirve como app, es solo material de consulta.

## Variables de entorno

| Name                   | Description             | Type     | Required | Default |
| ---------------------- | ----------------------- | -------- | -------- | ------- |
| PUBLIC_API_URL         | Api url                 | `string` | ✅       |         |
| PUBLIC_ES_API_URL      | Elastic Search Api url  | `string` | ✅       |         |
| NODE_ENV               | Node env                | `string` | ✅       |         |
| GOOGLE_OAUTH_ID        | Google oauth id         | `string` | ✅       |         |
| APP_URL                | Client url              | `string` | ✅       |         |
| PUBLIC_CHATBOT_URL     | Chatbot url             | `string` | ✅       |         |
| PUBLIC_STATS_URL       | Stats dashboard url     | `string` | ✅       |         |
| PUBLIC_TRENDS_URL      | Trends dashboard url    | `string` | ✅       |         |
| PUBLIC_SECTIONS        | Available sections list | `string` | ✅       |         |
| PUBLIC_SEARCH_API_KEY  | Search Api Key          | `string` | ✅       |         |

## Desarrollo local

```bash
npm install
npm run start:dev
```

Abre [http://localhost:3000](http://localhost:3000).

La API a la que apunta este frontend se levanta desde
[`trueflag-euroclimatecheck`](https://github.com/onionst) (compose local con MongoDB, MariaDB,
Qdrant, api y api-search). Credenciales de SUPER_ADMIN local: `ruben.miguez@trueflag.ai` / `Password1234!`.

## Maqueta

`public/maqueta/` contiene la maqueta original en HTML/CSS/JS plano que sirve de fuente para el
rediseño:

- `index.html` — review queue
- `articles.html`, `article.html` — listado y detalle
- `duplicates.html` — matches/duplicados
- `dashboard.html` — stats
- `organizations.html`, `users.html` — admin
- `pipeline.html` — feature nueva (sin backend todavía)
- `styles.css` — sistema de estilos (Archivo + Source Sans 3 + Source Serif 4 via Google Fonts; CSS vars)
- `app.js` — interacciones (sidebar, modales, kebabs, tabs)

Los fonts ya están enlazados desde `pages/_document.tsx` para que el `styles.css` de la maqueta
funcione cuando lo incluyamos por página.
