# Guia de Contribuição

## Como Contribuir

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Padrões de Código

### Vue Components

- Use Composition API com `<script setup>`
- Mantenha componentes pequenos e focados
- Use props tipadas com validação
- Emita eventos para comunicação pai-filho

### CSS

- Use CSS scoped para evitar conflitos
- Prefira variáveis CSS para valores reutilizáveis
- Siga a convenção BEM para classes quando apropriado
- Mantenha consistência com o sistema de design existente

### Nomenclatura

- **Componentes**: PascalCase (ex: `MetricCard.vue`)
- **Composables**: camelCase com prefixo `use` (ex: `useMetrics.js`)
- **Utilitários**: camelCase (ex: `formatters.js`)
- **Constantes**: UPPER_SNAKE_CASE

## Estrutura de Commits

Use mensagens descritivas:

```
feat: adiciona filtro de data range
fix: corrige cálculo de CPM
style: melhora responsividade da tabela
refactor: extrai lógica de formatação
docs: atualiza README com novos exemplos
```

## Testes

Antes de submeter um PR:

1. Verifique se o build funciona: `npm run build`
2. Teste em diferentes resoluções
3. Verifique acessibilidade básica
4. Teste em navegadores diferentes (Chrome, Firefox, Safari)

## Adicionando Novas Métricas

1. Adicione o campo em `src/data/mockData.js`
2. Atualize a função `getOverallMetrics()`
3. Adicione o card em `metricCards` no `App.vue`
4. Escolha um ícone apropriado ou crie um novo

## Adicionando Novos Gráficos

1. Crie o componente em `src/components/Charts/`
2. Registre os tipos necessários do Chart.js
3. Configure opções de estilo consistentes com o tema
4. Adicione ao layout no `App.vue`

## Questões e Sugestões

Abra uma issue para:

- Reportar bugs
- Sugerir novas funcionalidades
- Discutir mudanças significativas
- Pedir ajuda

## Código de Conduta

- Seja respeitoso e construtivo
- Aceite feedback com mente aberta
- Foque em melhorar o projeto
