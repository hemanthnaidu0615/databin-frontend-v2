export const salesTooltip = () => "Sales :";
export const revenueTooltip = () => "Revenue :";
export const costTooltip = () => "Total Cost :";
export const avgTimeTooltip = () => "Avg Time (hrs) :";
export const percentageTooltip = () => "Percentage :";
export const turnoverRateTooltip = () => "Turnover Rate :";
export const shipmentsTooltip = () => "Shipments :";
export const ordersTooltip = () => "Orders :";

export const getBaseTooltip = (
    isDark: boolean,
    yTitleFormatter: () => string = salesTooltip
) => ({
    enabled: true,
    theme: isDark ? "dark" : "light",
    x: {
        formatter: (val: number | string) => String(val),
    },
    y: {
        formatter: (val: number) => `$${val.toLocaleString()}`,
        title: { formatter: yTitleFormatter },
    },
    marker: { show: true },
});
