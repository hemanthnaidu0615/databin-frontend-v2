export const formatValue = (value: number): string =>
  new Intl.NumberFormat("en-IN").format(value);

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return `${formatDate(d)} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};
