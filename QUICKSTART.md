# Guia Rápido - AdMetrics Dashboard

## Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:5173
```

## Estrutura da Dashboard

### Cabeçalho

- Logo e título da aplicação
- Seletor de período (7, 14, 30, 60, 90 dias)
- Botão de exportação (CSV, JSON)
- Botão de atualização

### Estatísticas Rápidas

Três cards no topo mostrando:

- Campanhas ativas
- Taxa de conversão
- ROI médio

### Cards de Métricas (Grid 3x3)

Nove cards principais com:

- Ícone colorido
- Valor da métrica
- Variação percentual
- Mini-gráfico sparkline (últimos 14 dias)

Métricas disponíveis:

1. Resultados
2. Alcance
3. Frequência
4. Custo por Resultado
5. Orçamento Total
6. Valor Gasto
7. Impressões
8. CPM
9. Cliques no Link

### Gráficos Principais

**Performance ao Longo do Tempo** (Linha)

- Resultados, Alcance e Impressões
- Toggle para mostrar/ocultar métricas
- Interativo com hover

**Análise de Custos** (Barras)

- CPM vs Custo por Resultado
- Comparação diária

**Orçamento vs. Gasto** (Rosca)

- Percentual utilizado
- Valores absolutos

### Tabela de Campanhas

- Lista todas as campanhas
- Filtros: Todas, Ativas, Pausadas, Concluídas
- Ordenação por qualquer coluna
- Indicadores visuais de status
- Barra de progresso do orçamento

## Funcionalidades

### Interatividade

- Hover nos cards para ver efeitos
- Clique nas legendas dos gráficos para toggle
- Ordenação na tabela
- Filtros de status

### Exportação

- CSV: Dados tabulares das campanhas
- JSON: Dados completos incluindo métricas
- PDF: Em desenvolvimento

### Responsividade

- Desktop: 3 colunas
- Tablet: 2 colunas
- Mobile: 1 coluna
- Tabela com scroll horizontal em telas pequenas

## Personalizações

### Alterar Cores

Edite `src/assets/styles/variables.css`:

```css
:root {
  --color-primary: #4f46e5;
  --color-success: #10b981;
  /* ... */
}
```

### Alterar Fontes

Edite `index.html` e `variables.css`:

```css
--font-display: "SuaFonte", sans-serif;
--font-body: "OutraFonte", sans-serif;
```

### Adicionar Nova Métrica

1. Edite `src/data/mockData.js`
2. Adicione em `metricCards` no `App.vue`
3. Escolha um ícone em `src/components/Icon*.vue`

## Dados Mockados

Os dados são gerados automaticamente em `src/data/mockData.js`:

- 5 campanhas de exemplo
- 30 dias de histórico
- Valores realistas baseados em campanhas reais

Para integrar com API real:

1. Crie `src/services/facebookApi.js`
2. Substitua chamadas em `src/composables/useMetrics.js`
3. Configure variáveis de ambiente em `.env`

## Troubleshooting

### Servidor não inicia

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Gráficos não aparecem

Verifique se Chart.js está instalado:

```bash
npm list chart.js vue-chartjs
```

### Estilos quebrados

Limpe o cache do Vite:

```bash
rm -rf node_modules/.vite
npm run dev
```

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
