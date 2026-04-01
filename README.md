# AdMetrics - Facebook Ads Dashboard

<div align="center">

**Dashboard moderna e interativa para visualização de métricas do Facebook Ads Manager**

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vue.js)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=flat&logo=chart.js)](https://www.chartjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://admetrics-eight.vercel.app)

[Demo ao Vivo](https://admetrics-eight.vercel.app) • [GitHub](https://github.com/batinera/admetrics) • [Documentação](#documentação) • [Contribuir](CONTRIBUTING.md)

</div>

---

## ✨ Características

- **🎨 Design Único**: Interface profissional com tipografia Sora + DM Sans, paleta dark sofisticada e animações suaves
- **📊 Métricas Completas**: 9 cards principais + 3 gráficos interativos + tabela detalhada
- **🔍 Filtros Avançados**: Período (1d-90d), date range picker customizado, multi-seleção de campanhas
- **📈 Gráficos Interativos**: Linha, barras e rosca usando Chart.js com animações
- **📱 Totalmente Responsivo**: Layout adaptável para desktop, tablet e mobile
- **⚡ Performance**: Vue 3 + Vite para carregamento ultra-rápido (~110KB gzipped)
- **♿ Acessível**: WCAG AA compliant, navegação por teclado, screen reader friendly
- **🎭 Animações**: Entrada escalonada, transições suaves e micro-interações
- **📤 Exportação**: Dados em CSV e JSON

## Métricas Disponíveis

- Resultados
- Alcance
- Frequência
- Custo por Resultado
- Orçamento Total
- Valor Gasto
- Impressões
- CPM (Custo por Mil Impressões)
- Cliques no Link
- Data de Término das Campanhas

## Tecnologias

- Vue 3 (Composition API)
- Vite
- Chart.js + vue-chartjs
- date-fns
- CSS puro com variáveis

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Executar em modo desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:5173

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Backend (API)

A API Fastify está no repositório separado **admetrics-back** (irmão deste projeto). Para dados reais e auth:

1. Clona/configura **admetrics-back**, define `.env` (Postgres, `JWT_SECRET`, `ENCRYPTION_KEY`, etc.) e corre `npm run migrate` e `npm run dev` (porta `3001`).
2. Neste front, mantém `VITE_API_BASE_URL` vazio em desenvolvimento: o [vite.config.js](vite.config.js) faz proxy para `localhost:3001`.
3. Em produção, define `VITE_API_BASE_URL` com a URL pública da API (sem barra final). No backend, `FRONTEND_URL` e `PUBLIC_API_URL` devem corresponder ao front e à API expostos.

## 📸 Screenshots

### Dashboard Principal

- 9 cards de métricas com sparklines e indicadores de variação
- Estatísticas rápidas no topo (campanhas ativas, taxa de conversão, ROI)
- Design dark sofisticado com gradientes e efeitos de profundidade

### Gráficos Interativos

- **Performance**: Gráfico de linha com toggle de métricas (Resultados, Alcance, Impressões)
- **Custos**: Gráfico de barras comparando CPM e Custo por Resultado
- **Orçamento**: Gráfico de rosca mostrando utilização do orçamento

### Tabela de Campanhas

- Lista completa com todas as métricas
- Filtros por status (Ativas, Pausadas, Concluídas)
- Ordenação por qualquer coluna
- Indicadores visuais e barras de progresso

## Estrutura do Projeto

```
src/
├── App.vue                      # Componente principal
├── main.js                      # Entry point
├── assets/
│   └── styles/
│       ├── variables.css        # Variáveis CSS (cores, fontes, etc)
│       ├── animations.css       # Animações e transições
│       └── main.css            # Estilos globais
├── components/
│   ├── Header.vue              # Cabeçalho da dashboard
│   ├── MetricCard.vue          # Card de métrica reutilizável
│   ├── CampaignTable.vue       # Tabela de campanhas
│   ├── Charts/
│   │   ├── PerformanceChart.vue    # Gráfico de performance
│   │   ├── CostAnalysisChart.vue   # Gráfico de custos
│   │   └── BudgetDonutChart.vue    # Gráfico de orçamento
│   └── Icon*.vue               # Componentes de ícones
└── data/
    └── mockData.js             # Dados mockados para desenvolvimento
```

## 📚 Documentação Completa

- **[QUICKSTART.md](QUICKSTART.md)** - Guia de início rápido
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitetura e detalhes técnicos
- **[FEATURES.md](FEATURES.md)** - Lista completa de funcionalidades
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guias de deploy
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Como contribuir
- **[COMMANDS.md](COMMANDS.md)** - Comandos úteis
- **[CHANGELOG.md](CHANGELOG.md)** - Histórico de versões

## 🎯 Próximos Passos

### v1.1 - Integrações

- [ ] Integração com Facebook Marketing API
- [ ] Autenticação OAuth
- [ ] Cache de dados

### v1.2 - Funcionalidades

- [x] Filtros avançados (date range picker)
- [ ] Comparação entre períodos
- [ ] Exportação em PDF
- [ ] Alertas personalizados

### v2.0 - Avançado

- [ ] Dashboard customizável
- [ ] Múltiplas contas
- [x] Backend em repositório separado (**admetrics-back**)
- [ ] Relatórios agendados

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre como contribuir.

## 📄 Licença

MIT

## 🌟 Agradecimentos

Desenvolvido com Vue 3, Chart.js e muito café ☕

---

**Status**: ✅ Produção Ready | **Versão**: 1.0.0 | **Build**: ~110KB gzipped
