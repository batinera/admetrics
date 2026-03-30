# Arquitetura da Dashboard AdMetrics

## Visão Geral

Dashboard moderna construída com Vue 3 e Vite para visualização de métricas do Facebook Ads Manager.

## Stack Tecnológica

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 5.x
- **Gráficos**: Chart.js + vue-chartjs
- **Datas**: date-fns
- **Estilo**: CSS puro com variáveis CSS

## Estrutura de Componentes

```
App.vue (Root)
├── Header.vue
│   ├── PeriodSelector.vue
│   └── IconRefresh.vue
├── QuickStats.vue
├── MetricCard.vue (x9)
│   └── Icon*.vue
├── Charts/
│   ├── PerformanceChart.vue
│   ├── CostAnalysisChart.vue
│   └── BudgetDonutChart.vue
├── CampaignTable.vue
│   ├── IconSort.vue
│   └── StatusBadge.vue
└── Footer.vue
```

## Fluxo de Dados

### Estado Global (Composable)

O hook `useMetrics` gerencia todo o estado da aplicação:

```javascript
{
  metrics: Object,           // Métricas agregadas
  timeSeriesData: Array,     // Dados temporais para gráficos
  campaigns: Array,          // Lista de campanhas
  isLoading: Boolean,        // Estado de carregamento
  error: String | null       // Mensagens de erro
}
```

### Dados Mockados

Estrutura em `src/data/mockData.js`:

- 5 campanhas de exemplo
- 30 dias de dados históricos por campanha
- Funções de agregação e cálculo de métricas

## Sistema de Design

### Paleta de Cores

- **Background**: Tons escuros (#0a0e1a, #0f1420)
- **Surface**: Cards e elementos (#1a1f35, #252b45)
- **Primary**: Azul/Roxo (#4f46e5, #7c3aed)
- **Success**: Verde (#10b981)
- **Warning**: Laranja (#f59e0b)
- **Danger**: Vermelho (#ef4444)

### Tipografia

- **Display**: Sora (títulos, valores numéricos)
- **Body**: DM Sans (texto geral, labels)

### Animações

- Entrada escalonada (stagger) para cards
- Transições suaves em hover
- Skeleton loading durante carregamento
- Micro-interações nos botões e cards

## Responsividade

### Breakpoints

- **Desktop**: > 1400px (3 colunas)
- **Tablet**: 768px - 1400px (2 colunas)
- **Mobile**: < 768px (1 coluna)

### Adaptações Mobile

- Header compacto
- Filtros em layout vertical
- Tabela com scroll horizontal
- Gráficos com altura reduzida

## Performance

### Otimizações

1. **Code Splitting**: Chunks separados para Chart.js e date-fns
2. **Lazy Loading**: Componentes carregados sob demanda
3. **CSS Scoped**: Estilos isolados por componente
4. **Vite HMR**: Hot Module Replacement para desenvolvimento rápido

### Métricas Esperadas

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: ~200KB (gzipped)

## Acessibilidade

- Roles ARIA apropriados
- Labels descritivos
- Suporte a teclado
- Contraste adequado (WCAG AA)
- Suporte a `prefers-reduced-motion`

## Próximas Etapas

### Integração com API

1. Criar serviço de API (`src/services/facebookApi.js`)
2. Implementar autenticação OAuth
3. Substituir dados mockados por chamadas reais
4. Adicionar cache e retry logic

### Funcionalidades Futuras

- Filtros avançados (data range picker)
- Exportação de relatórios (PDF/Excel)
- Comparação entre períodos
- Alertas personalizados
- Dashboard customizável (drag & drop)
- Modo escuro/claro toggle
- Múltiplas contas do Facebook

## Manutenção

### Adicionar Nova Métrica

1. Adicionar campo em `mockData.js`
2. Criar entrada em `metricCards` no App.vue
3. Atualizar tipo TypeScript (se usar)

### Adicionar Novo Gráfico

1. Criar componente em `src/components/Charts/`
2. Registrar tipos do Chart.js necessários
3. Adicionar ao layout do App.vue

### Atualizar Estilo

Todas as variáveis CSS estão em `src/assets/styles/variables.css` para fácil customização.
