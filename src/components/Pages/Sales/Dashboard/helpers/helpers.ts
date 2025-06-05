import moment from "moment";

export const formatDate = (date: any) => {
  return moment(new Date(date)).format("DD-MM-YYYY");
};

export function isDate(dateStr: any) {
  return !isNaN(new Date(dateStr).getDate());
}

export const abbrvalue = (value: any) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};
