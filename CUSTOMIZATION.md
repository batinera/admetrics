# Guia de Customização - AdMetrics

## Mudando as Cores

### Paleta Principal

Edite `src/assets/styles/variables.css`:

```css
:root {
  /* Cores primárias */
  --color-primary: #4f46e5; /* Azul principal */
  --color-secondary: #7c3aed; /* Roxo secundário */

  /* Cores de status */
  --color-success: #10b981; /* Verde (positivo) */
  --color-warning: #f59e0b; /* Laranja (atenção) */
  --color-danger: #ef4444; /* Vermelho (negativo) */

  /* Background */
  --color-background: #0a0e1a; /* Fundo principal */
  --color-surface: #1a1f35; /* Cards e elementos */
}
```

### Tema Claro (Exemplo)

```css
:root {
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-border: #e2e8f0;
}
```

## Mudando as Fontes

### 1. Escolher Fontes no Google Fonts

Visite [Google Fonts](https://fonts.google.com) e escolha suas fontes.

### 2. Atualizar index.html

```html
<link
  href="https://fonts.googleapis.com/css2?family=SuaFonteDisplay:wght@600;700;800&family=SuaFonteBody:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

### 3. Atualizar variables.css

```css
:root {
  --font-display: "SuaFonteDisplay", sans-serif;
  --font-body: "SuaFonteBody", sans-serif;
}
```

### Sugestões de Combinações

**Moderna e Limpa**

- Display: Inter / Body: Inter
- Display: Poppins / Body: Open Sans

**Editorial**

- Display: Playfair Display / Body: Source Sans Pro
- Display: Merriweather / Body: Lato

**Tech/Futurista**

- Display: Orbitron / Body: Rajdhani
- Display: Exo 2 / Body: Roboto

**Elegante**

- Display: Cormorant / Body: Lora
- Display: Crimson Pro / Body: Work Sans

## Mudando o Layout

### Grid de Cards

Em `src/App.vue`:

```css
/* 4 colunas */
.dashboard-grid {
  grid-template-columns: repeat(4, 1fr);
}

/* 2 colunas */
.dashboard-grid {
  grid-template-columns: repeat(2, 1fr);
}

/* Layout assimétrico */
.dashboard-grid {
  grid-template-columns: 2fr 1fr 1fr;
}
```

### Tamanho dos Cards

Em `src/components/MetricCard.vue`:

```css
.metric-card {
  min-height: 200px; /* Aumentar altura */
  padding: 2rem; /* Mais espaçamento */
}

.metric-card__value {
  font-size: 2.5rem; /* Valores maiores */
}
```

## Adicionando Nova Métrica

### 1. Adicionar aos Dados Mockados

`src/data/mockData.js`:

```javascript
export const getOverallMetrics = () => {
  // ... código existente ...

  return {
    // ... métricas existentes ...

    novaMetrica: {
      value: 12345,
      change: 15.5,
      trend: "up",
    },
  };
};
```

### 2. Adicionar Card no App.vue

```javascript
const metricCards = computed(() => {
  return [
    // ... cards existentes ...

    {
      label: "Nova Métrica",
      value: metrics.value.novaMetrica.value,
      change: metrics.value.novaMetrica.change,
      trend: metrics.value.novaMetrica.trend,
      icon: "chart", // ou crie um novo ícone
      format: "number",
      subtitle: "descrição opcional",
    },
  ];
});
```

### 3. (Opcional) Criar Novo Ícone

`src/components/IconNovo.vue`:

```vue
<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <!-- Seu SVG path aqui -->
  </svg>
</template>
```

## Customizando Gráficos

### Cores do Gráfico

Em qualquer componente de Chart:

```javascript
const chartData = computed(() => ({
  datasets: [
    {
      borderColor: "#sua-cor",
      backgroundColor: "rgba(sua-cor, 0.2)",
      // ...
    },
  ],
}));
```

### Opções do Gráfico

```javascript
const chartOptions = {
  plugins: {
    tooltip: {
      backgroundColor: "#sua-cor",
      // ...
    },
  },
  scales: {
    y: {
      grid: {
        color: "#sua-cor-grid",
      },
    },
  },
};
```

## Mudando Animações

### Velocidade das Animações

`src/assets/styles/variables.css`:

```css
:root {
  --transition-fast: 100ms; /* Mais rápido */
  --transition-base: 200ms; /* Mais rápido */
  --transition-slow: 300ms; /* Mais rápido */
}
```

### Desabilitar Animações

```css
* {
  animation: none !important;
  transition: none !important;
}
```

### Criar Nova Animação

`src/assets/styles/animations.css`:

```css
@keyframes minhaAnimacao {
  from {
    opacity: 0;
    transform: scale(0.8) rotate(-5deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.minha-classe {
  animation: minhaAnimacao 0.5s ease-out;
}
```

## Customizando a Tabela

### Adicionar Nova Coluna

`src/components/CampaignTable.vue`:

```vue
<template>
  <thead>
    <tr>
      <!-- ... colunas existentes ... -->
      <th @click="sortBy('novaColuna')" class="sortable">
        <span>Nova Coluna</span>
        <IconSort :active="sortKey === 'novaColuna'" />
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="campaign in sortedCampaigns">
      <!-- ... células existentes ... -->
      <td>{{ campaign.novaColuna }}</td>
    </tr>
  </tbody>
</template>
```

### Mudar Cores das Barras de Progresso

```css
.budget-bar-fill--success {
  background: linear-gradient(90deg, #sua-cor 0%, #sua-cor-clara 100%);
}
```

## Adicionando Novo Gráfico

### 1. Criar Componente

`src/components/Charts/MeuGrafico.vue`:

```vue
<template>
  <div class="chart-container card">
    <div class="chart-header">
      <h3>Meu Gráfico</h3>
    </div>
    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
// ... imports do Chart.js ...

const props = defineProps({
  data: Array,
});

const chartData = computed(() => ({
  // ... configuração do gráfico
}));
</script>
```

### 2. Adicionar ao App.vue

```vue
<template>
  <div class="charts-grid">
    <!-- ... gráficos existentes ... -->
    <MeuGrafico :data="meusDados" />
  </div>
</template>
```

## Mudando o Logo

### 1. Substituir SVG no Header

`src/components/Header.vue`:

```vue
<div class="logo">
  <img src="/seu-logo.svg" alt="Logo" />
  <!-- ou -->
  <svg><!-- seu SVG inline --></svg>
</div>
```

### 2. Atualizar Favicon

Substitua `public/favicon.svg` com seu ícone.

## Customizando Sparklines

### Cores

`src/components/MetricCard.vue`:

```javascript
const sparklineColor = computed(() => {
  if (props.trend === "up") return "#sua-cor-positiva";
  if (props.trend === "down") return "#sua-cor-negativa";
  return "#sua-cor-neutra";
});
```

### Tamanho

```javascript
const sparklineWidth = 150; // Mais largo
const sparklineHeight = 50; // Mais alto
```

## Mudando Breakpoints

`src/assets/styles/main.css`:

```css
/* Tablet */
@media (max-width: 1200px) {
  /* era 1400px */
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 640px) {
  /* era 768px */
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

## Adicionando Filtros Customizados

### 1. Criar Estado

```javascript
const customFilter = ref("all");
```

### 2. Adicionar UI

```vue
<select v-model="customFilter">
  <option value="all">Todos</option>
  <option value="high">Alto Desempenho</option>
  <option value="low">Baixo Desempenho</option>
</select>
```

### 3. Aplicar Filtro

```javascript
const filteredData = computed(() => {
  if (customFilter.value === "high") {
    return data.value.filter((item) => item.performance > 80);
  }
  // ...
});
```

## Mudando Formato de Números

`src/utils/formatters.js`:

```javascript
// Usar ponto em vez de vírgula
export const formatNumber = (value) => {
  return new Intl.NumberFormat("en-US").format(value);
};

// Mudar moeda
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // era BRL
  }).format(value);
};
```

## Adicionando Dark/Light Mode Toggle

### 1. Criar Variáveis para Ambos os Temas

```css
[data-theme="light"] {
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text-primary: #0f172a;
}

[data-theme="dark"] {
  --color-background: #0a0e1a;
  --color-surface: #1a1f35;
  --color-text-primary: #f8fafc;
}
```

### 2. Criar Toggle

```vue
<script setup>
import { ref, watch } from "vue";

const theme = ref("dark");

watch(theme, (newTheme) => {
  document.documentElement.setAttribute("data-theme", newTheme);
});
</script>

<template>
  <button @click="theme = theme === 'dark' ? 'light' : 'dark'">
    Toggle Theme
  </button>
</template>
```

## Dicas de Performance

### 1. Lazy Load de Gráficos

```javascript
import { defineAsyncComponent } from "vue";

const PerformanceChart = defineAsyncComponent(
  () => import("./components/Charts/PerformanceChart.vue"),
);
```

### 2. Virtualização da Tabela

Para muitas campanhas (100+), considere usar `vue-virtual-scroller`.

### 3. Debounce em Filtros

```javascript
import { debounce } from "lodash-es";

const handleFilter = debounce((value) => {
  // filtrar dados
}, 300);
```

## Integrando com Backend

### 1. Criar Serviço de API

```javascript
// src/services/api.js
export async function fetchMetrics() {
  const response = await fetch("/api/metrics");
  return response.json();
}
```

### 2. Atualizar Composable

```javascript
// src/composables/useMetrics.js
import { fetchMetrics } from "../services/api";

const loadData = async () => {
  const data = await fetchMetrics();
  metrics.value = data;
};
```

## Recursos Adicionais

- [Vue 3 Docs](https://vuejs.org)
- [Chart.js Docs](https://www.chartjs.org)
- [Vite Docs](https://vitejs.dev)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Dica**: Sempre teste suas customizações em diferentes resoluções e navegadores!
