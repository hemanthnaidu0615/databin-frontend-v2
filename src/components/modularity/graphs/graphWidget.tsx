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
        show: true,
        formatter: (val: number) => String(val),
    },

    y: {
        formatter: (val: number) => {
            if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
            if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
            if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
            return `$${val}`;
        },
        title: {
            formatter: () => yTitleFormatter(),
        },
    },

    marker: { show: false },
});


export const getBaseToolTip = (
    isDark: boolean,
    yTitleFormatter: () => string = salesTooltip
) => ({
    enabled: true,
    theme: isDark ? "dark" : "light",

    x: {
        show: true,
        formatter: (_val: string | number, opts: any) => {
       return opts?.w?.globals?.categoryLabels?.[opts.dataPointIndex] ?? "";
        },
    },

    y: {
        formatter: (val: number) => {
            if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
            if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
            if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
            return `$${val}`;
        },
        title: {
            formatter: () => yTitleFormatter(),
        },
    },

    marker: { show: false },
});