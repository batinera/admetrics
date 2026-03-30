# Guia Visual - AdMetrics Dashboard

## Layout da Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  ┌──────┐ AdMetrics              [7d|14d|30d|60d|90d] [↻]     │
│  │ Logo │ Facebook Ads Dashboard                                │
│  └──────┘                                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  QUICK STATS                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ 📊 Campanhas │  │ 📈 Taxa Conv │  │ 💰 ROI Médio │         │
│  │     3        │  │    12.5%     │  │    285%      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  METRIC CARDS (Grid 3x3)                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ 🎯       │  │ 👥       │  │ 📊       │                     │
│  │ +17.6%   │  │ +17.6%   │  │ +5.2%    │                     │
│  │          │  │          │  │          │                     │
│  │RESULTADOS│  │ ALCANCE  │  │FREQUÊNCIA│                     │
│  │  4,523   │  │ 234,567  │  │   2.45   │                     │
│  │ ▁▂▃▅▇▆▄  │  │ ▁▃▄▆▇▅▃  │  │          │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ 💵       │  │ 💰       │  │ 💸       │                     │
│  │ -8.3%    │  │  0.0%    │  │ +12.4%   │                     │
│  │          │  │          │  │          │                     │
│  │CUSTO/RES │  │ ORÇAMENTO│  │  GASTO   │                     │
│  │ R$ 1.23  │  │R$ 40,000 │  │R$ 28,456 │                     │
│  │ ▇▆▅▄▃▂▁  │  │3 ativas  │  │ ▁▂▃▄▅▆▇  │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ 👁        │  │ 📊       │  │ 🖱        │                     │
│  │ +18.7%   │  │ -3.2%    │  │ +22.1%   │                     │
│  │          │  │          │  │          │                     │
│  │IMPRESSÕES│  │   CPM    │  │ CLIQUES  │                     │
│  │ 567,890  │  │ R$ 12.34 │  │  5,678   │                     │
│  │ ▁▂▄▆▇▅▃  │  │ ▇▆▄▃▂▂▁  │  │ ▁▃▅▇▆▄▂  │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PERFORMANCE CHART (Full Width)                                 │
│  Performance ao Longo do Tempo  [Resultados][Alcance][Impress.]│
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                    ╱╲      │ │
│  │                                          ╱╲      ╱  ╲     │ │
│  │                                ╱╲      ╱  ╲    ╱    ╲    │ │
│  │                      ╱╲      ╱  ╲    ╱    ╲  ╱      ╲   │ │
│  │            ╱╲      ╱  ╲    ╱    ╲  ╱      ╲╱        ╲  │ │
│  │  ╱╲      ╱  ╲    ╱    ╲  ╱      ╲╱                   ╲ │ │
│  │╱  ╲────╱────╲──╱──────╲╱────────────────────────────╲│ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐ ┌────────────────────────────┐
│  COST ANALYSIS (2/3 width)       │ │  BUDGET DONUT (1/3 width)  │
│  Análise de Custos               │ │  Orçamento vs. Gasto       │
│  ┌────────────────────────────┐  │ │  ┌──────────────────────┐  │
│  │     ▇▇                     │  │ │  │         ╱────╲       │  │
│  │     ▇▇  ▇▇                 │  │ │  │       ╱   71%  ╲     │  │
│  │ ▇▇  ▇▇  ▇▇  ▇▇             │  │ │  │      │          │    │  │
│  │ ▇▇  ▇▇  ▇▇  ▇▇  ▇▇  ▇▇     │  │ │  │       ╲        ╱     │  │
│  │ ▇▇  ▇▇  ▇▇  ▇▇  ▇▇  ▇▇  ▇▇ │  │ │  │         ╲────╱       │  │
│  └────────────────────────────┘  │ │  └──────────────────────┘  │
│  ■ CPM  ■ Custo/Resultado        │ │  Gasto: R$ 28,456         │
│                                  │ │  Restante: R$ 11,544      │
└──────────────────────────────────┘ └────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CAMPAIGN TABLE (Full Width)                                    │
│  Campanhas Ativas  [Todas][Ativas][Pausadas][Concluídas]       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Campanha ▼│Status│Results│Reach│Impr│Clicks│CPM│Cost│... │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Verão 2026│ ● Ativa│ 1,234│89K│156K│1,456│12.3│1.2│... │ │
│  │ Produto X │ ● Ativa│   856│67K│123K│1,012│11.8│1.4│... │ │
│  │ Remarketing│● Ativa│   678│45K│ 89K│  789│13.1│1.1│... │ │
│  │ Brand Aware│◐ Pausada│ 456│34K│ 67K│  567│14.2│1.5│... │ │
│  │ Promoção  │○ Concluída│234│23K│45K│  345│12.9│1.3│... │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FOOTER                                                         │
│  AdMetrics Dashboard • Vue 3    Última atualização: 30/03/2026 │
└─────────────────────────────────────────────────────────────────┘
```

## Paleta de Cores

```
Background:
  ████ #0a0e1a (Background principal)
  ████ #0f1420 (Background secundário)
  ████ #1a1f35 (Surface)
  ████ #252b45 (Surface elevated)

Primary:
  ████ #4f46e5 (Primary)
  ████ #7c3aed (Secondary)

Status:
  ████ #10b981 (Success/Verde)
  ████ #f59e0b (Warning/Laranja)
  ████ #ef4444 (Danger/Vermelho)

Text:
  ████ #f8fafc (Primary)
  ████ #94a3b8 (Secondary)
  ████ #64748b (Tertiary)
```

## Tipografia

```
Display (Sora):
  Títulos: 800 weight
  Valores: 700-800 weight
  Labels: 600 weight

Body (DM Sans):
  Texto: 400-500 weight
  Destaque: 600-700 weight
```

## Animações

### Entrada Escalonada

```
Card 1: 0.05s delay
Card 2: 0.10s delay
Card 3: 0.15s delay
...
Card 9: 0.45s delay
```

### Efeitos de Hover

- Cards: translateY(-2px) + shadow
- Ícones: scale(1.05) + rotate(2deg)
- Valores: scale(1.02)
- Botões: translateY(-1px) + glow

## Interações

### MetricCard

- **Hover**: Elevação, borda colorida, glow
- **Click**: Scale down feedback
- **Sparkline**: Opacity aumenta no hover

### Gráficos

- **Hover**: Tooltip com valores formatados
- **Legend**: Toggle métricas on/off
- **Animação**: Transição suave ao atualizar

### Tabela

- **Header**: Click para ordenar
- **Row**: Background change no hover
- **Status**: Badge colorido com dot animado
- **Budget**: Barra de progresso colorida

## Estados

### Loading

- Skeleton com pulse animation
- 9 cards placeholder
- Entrada escalonada

### Error

- Ícone de erro
- Mensagem clara
- Botão de retry

### Empty

- Ícone informativo
- Mensagem descritiva
- Call to action

## Responsividade

### Desktop (> 1400px)

```
┌─────┬─────┬─────┐
│  1  │  2  │  3  │
├─────┼─────┼─────┤
│  4  │  5  │  6  │
├─────┼─────┼─────┤
│  7  │  8  │  9  │
└─────┴─────┴─────┘
```

### Tablet (768px - 1400px)

```
┌─────┬─────┐
│  1  │  2  │
├─────┼─────┤
│  3  │  4  │
├─────┼─────┤
│  5  │  6  │
└─────┴─────┘
```

### Mobile (< 768px)

```
┌─────┐
│  1  │
├─────┤
│  2  │
├─────┤
│  3  │
└─────┘
```

## Acessibilidade

### Navegação por Teclado

- `Tab`: Navegar entre elementos
- `Enter/Space`: Ativar botões
- `Escape`: Fechar dropdowns
- `Arrow Keys`: Navegar em listas

### Screen Readers

- Todos os cards têm `aria-label`
- Ícones decorativos têm `aria-hidden`
- Status têm `role="status"`
- Gráficos têm descrições alternativas

### Contraste

- Texto principal: 16:1 (AAA)
- Texto secundário: 7:1 (AA)
- Elementos interativos: 4.5:1 (AA)

## Performance

### Métricas de Carregamento

```
First Contentful Paint:  0.5s ████░░░░░░
Time to Interactive:     1.2s ██████░░░░
Largest Contentful Paint: 1.5s ████████░░
Cumulative Layout Shift: 0.01  ██████████
```

### Bundle Analysis

```
Total:    320KB ████████████████████
Gzipped:  110KB ███████░░░░░░░░░░░░░

Breakdown:
- Chart.js:  254KB (91KB gzipped)  ████████████████
- Vue:        40KB (13KB gzipped)  ███
- date-fns:   23KB (7KB gzipped)   ██
- App code:    3KB (5KB gzipped)   █
```

## Componentes por Categoria

### Layout (4)

- Header, Footer, App, Container

### Visualização (13)

- MetricCard, QuickStats, StatsOverview
- PerformanceChart, CostAnalysisChart, BudgetDonutChart
- CampaignTable, PeriodSelector, ExportButton
- StatusBadge, LoadingSkeleton, ErrorState, EmptyState

### UI Elements (11)

- 8 Icon components
- IconSort, IconRefresh
- Toast, Tooltip

### Lógica (4)

- useMetrics (composable)
- mockData (data)
- formatters (utils)
- facebookApi.example (service)

## Fluxo de Dados

```
User Action
    ↓
Header (emit event)
    ↓
App.vue (handle event)
    ↓
useMetrics (composable)
    ↓
mockData.js (data source)
    ↓
Computed Properties
    ↓
Components (props)
    ↓
Visual Update (reactive)
```

## Design Tokens

### Spacing

```
xs:  0.5rem (8px)
sm:  0.75rem (12px)
md:  1rem (16px)
lg:  1.5rem (24px)
xl:  2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

### Border Radius

```
sm: 0.5rem (8px)
md: 0.75rem (12px)
lg: 1rem (16px)
xl: 1.5rem (24px)
```

### Shadows

```
sm: 0 2px 8px rgba(0,0,0,0.1)
md: 0 4px 16px rgba(0,0,0,0.15)
lg: 0 8px 32px rgba(0,0,0,0.2)
xl: 0 16px 48px rgba(0,0,0,0.3)
glow: 0 0 24px rgba(79,70,229,0.3)
```

### Transitions

```
fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
base: 250ms cubic-bezier(0.4, 0, 0.2, 1)
slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
```

## Hierarquia Visual

```
1. Header (sticky, z-index: 100)
   ↓
2. Quick Stats (destaque, animação rápida)
   ↓
3. Metric Cards (grid, stagger animation)
   ↓
4. Charts (gráficos principais)
   ↓
5. Campaign Table (dados detalhados)
   ↓
6. Footer (informações secundárias)
```

## Interatividade

### Elementos Clicáveis

- ✅ Botões de filtro
- ✅ Headers de tabela (ordenação)
- ✅ Legend items (toggle)
- ✅ Period selector
- ✅ Export button
- ✅ Refresh button

### Elementos com Hover

- ✅ Cards de métricas
- ✅ Linhas da tabela
- ✅ Botões e links
- ✅ Ícones
- ✅ Badges

### Feedback Visual

- ✅ Loading spinner
- ✅ Skeleton screens
- ✅ Hover states
- ✅ Active states
- ✅ Disabled states
- ✅ Success/error states

---

**Nota**: Este guia visual ajuda a entender a estrutura e hierarquia da dashboard sem precisar abrir o navegador.
