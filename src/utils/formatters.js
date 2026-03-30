export const formatNumber = (value) => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value) => {
  return `${value.toFixed(1)}%`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

export const formatCompactNumber = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "k";
  }
  return value.toString();
};
