import { useSelector } from "react-redux";

export const useDateRangeEnterprise = () => {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  return { dateRange, enterpriseKey };
};
