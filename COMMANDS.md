# Comandos Úteis - AdMetrics

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## Limpeza e Manutenção

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar build
rm -rf dist

# Limpar cache do Vite
rm -rf node_modules/.vite
```

## Verificação de Qualidade

```bash
# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Listar dependências
npm list --depth=0

# Verificar versões desatualizadas
npm outdated
```

## Git

```bash
# Inicializar repositório
git init
git add .
git commit -m "Initial commit: AdMetrics Dashboard"

# Adicionar remote
git remote add origin <seu-repositorio>
git push -u origin main
```

## Análise de Bundle

```bash
# Instalar analisador
npm install -D rollup-plugin-visualizer

# Adicionar ao vite.config.js:
# import { visualizer } from 'rollup-plugin-visualizer'
# plugins: [vue(), visualizer()]

# Build e analisar
npm run build
# Abrir stats.html gerado
```

## Testes de Performance

```bash
# Lighthouse CI (instalar globalmente)
npm install -g @lhci/cli

# Executar audit
npm run build
lhci autorun
```

## Deploy Rápido

```bash
# Vercel
npx vercel

# Netlify
npx netlify deploy --prod

# GitHub Pages
npm run build
npx gh-pages -d dist
```

## Desenvolvimento com Docker

```bash
# Build da imagem
docker build -t admetrics .

# Executar container
docker run -p 8080:80 admetrics

# Desenvolvimento com volume
docker run -p 5173:5173 -v $(pwd):/app -w /app node:20-alpine npm run dev
```

## Utilitários

```bash
# Contar linhas de código
find src -name "*.vue" -o -name "*.js" -o -name "*.css" | xargs wc -l

# Listar todos os componentes
find src/components -name "*.vue" | sort

# Verificar tamanho do bundle
du -sh dist/

# Verificar tamanho dos assets
ls -lh dist/assets/
```

## Troubleshooting

```bash
# Servidor não inicia
killall node
npm run dev

# Porta em uso
lsof -ti:5173 | xargs kill -9
npm run dev

# Dependências corrompidas
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Integração Contínua

Exemplo de GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Monitoramento

```bash
# Instalar Sentry (error tracking)
npm install @sentry/vue

# Instalar analytics
npm install vue-gtag-next
```

## Backup

```bash
# Backup completo (excluindo node_modules)
tar -czf admetrics-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=.git \
  .
```

## Referências Rápidas

- **Dev Server**: http://localhost:5173
- **Docs Vue 3**: https://vuejs.org
- **Docs Chart.js**: https://www.chartjs.org
- **Facebook Marketing API**: https://developers.facebook.com/docs/marketing-apis
