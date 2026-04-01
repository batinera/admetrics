# Guia de Deploy - AdMetrics Dashboard

## Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

O build gera os arquivos na pasta `dist/` prontos para deploy.

## Opções de Deploy

### 1. Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Ou conecte o repositório no dashboard da Vercel para deploy automático.

**Configuração**: Nenhuma necessária, Vercel detecta automaticamente projetos Vite.

### 2. Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Configurações**:

- Build command: `npm run build`
- Publish directory: `dist`

### 3. GitHub Pages

1. Adicione ao `vite.config.js`:

```javascript
export default defineConfig({
  base: "/admetrics/", // nome do repositório
  // ... resto da config
});
```

2. Instale gh-pages:

```bash
npm install -D gh-pages
```

3. Adicione script ao `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. Deploy:

```bash
npm run deploy
```

### 4. Docker

Crie `Dockerfile`:

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build e run:

```bash
docker build -t admetrics .
docker run -p 8080:80 admetrics
```

### 5. Servidor Estático (Nginx/Apache)

Após `npm run build`, copie a pasta `dist/` para o servidor:

**Nginx** (`/etc/nginx/sites-available/admetrics`):

```nginx
server {
    listen 80;
    server_name admetrics.seudominio.com;
    root /var/www/admetrics;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Apache** (`.htaccess`):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Variáveis de Ambiente

### Frontend (este repositório)

Configure no painel do host (ex. Vercel) ou em `.env.production`:

```env
# Modo só mock, sem chamar API
# VITE_USE_MOCK=true

# URL pública da API AdMetrics (repo admetrics-back), sem barra final
VITE_API_BASE_URL=https://api.seudominio.com

# Opcional: mock desligado para usar a API
VITE_USE_MOCK=false
```

Em desenvolvimento local, podes deixar `VITE_API_BASE_URL` vazio e correr a API em `localhost:3001` (proxy no `vite.config.js`).

### Backend (`admetrics-back`)

No serviço onde a API está deployed, define pelo menos `DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY`, `FRONTEND_URL` (URL do front para CORS), `PUBLIC_API_URL` (URL desta API, usada no OAuth Meta). Ver `.env.example` nesse repositório.

## Otimizações de Produção

### 1. Compressão

Habilite gzip/brotli no servidor:

**Nginx**:

```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 2. Cache

Configure headers de cache:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN

Considere usar CDN para assets estáticos:

- Cloudflare
- AWS CloudFront
- Fastly

### 4. Monitoramento

Adicione analytics e monitoramento:

- Google Analytics
- Sentry (error tracking)
- LogRocket (session replay)

## Checklist de Deploy

- [ ] Build funciona sem erros (`npm run build`)
- [ ] Preview do build funciona (`npm run preview`)
- [ ] Variáveis de ambiente configuradas (`VITE_API_BASE_URL` aponta para a API em **admetrics-back** se não usares mock)
- [ ] API em produção com `FRONTEND_URL` e `PUBLIC_API_URL` corretos
- [ ] Testes em diferentes navegadores
- [ ] Testes de responsividade
- [ ] Verificação de acessibilidade
- [ ] Performance audit (Lighthouse)
- [ ] Configuração de domínio
- [ ] SSL/HTTPS habilitado
- [ ] Monitoramento configurado

## Troubleshooting

### Build Falha

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Rotas 404 em Produção

Configure o servidor para redirecionar todas as rotas para `index.html` (SPA mode).

### Assets não carregam

Verifique a configuração de `base` no `vite.config.js` se estiver em subdiretório.

## Suporte

Para problemas de deploy, abra uma issue no repositório.
