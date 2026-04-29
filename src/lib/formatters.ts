import { format } from "date-fns";
import { es } from "date-fns/locale";

export const formatCurrency = (value: number) => {
  if (isNaN(value)) return "S/ 0.00";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2) => {
  if (isNaN(value)) return "0";
  return new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), "dd MMM yyyy, HH:mm", { locale: es });
};
