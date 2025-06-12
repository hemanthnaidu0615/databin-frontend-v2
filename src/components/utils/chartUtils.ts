import { ApexOptions } from "apexcharts";
export const INR_TO_USD = 1 / 83.3;

export const formatUSD = (value: number): string => {
    const usd = value * INR_TO_USD;
    if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
    if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
    return `$${usd.toFixed(0)}`;
};

export const formatValue = (value: number): string => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toFixed(0);
};

export const usdTooltipFormatter: ApexOptions["tooltip"] = {
    enabled: true,
    y: {
        formatter: formatUSD,
    },
};

export const tooltipFormatter: ApexOptions["tooltip"] = {
    enabled: true,
    y: {
        formatter: formatValue,
    },
};

export const tooltip: ApexOptions["tooltip"] = {
    enabled: true,
    x: {
        show: true,
        formatter: (val) => `${val}`,
    },
    y: {
        formatter: (value: number) => `${value.toFixed(2)} hrs`,
    },
};

export const getYAxis = (title = "Value"): ApexOptions["yaxis"] => ({
    title: {
        text: title,
        style: {
            fontWeight: "normal",
            fontSize: "14px",
            color: "#a855f7",
        },
    },
    labels: {
        formatter: formatValue,
        style: {
            fontSize: "12px",
        },
    },
});

export const monthXAxis: ApexOptions["xaxis"] = {
    type: "category",
    categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    axisBorder: { show: false },
    axisTicks: { show: false },
    title: {
        text: "Month",
        style: {
            fontWeight: "normal",
            fontSize: "14px",
            color: "#a855f7",
        },
    },
    labels: {
        style: {
            fontSize: "12px",
        },
    },
    crosshairs: { show: false },
};

export const fulfillmentStages = [
    "Picked", "Packed", "Shipped", "Delivered"
];

export const defaultStagesOrder = [
    "Order Placed",
    "Processing",
    "Distribution Center",
    "Warehouse",
    "Store Pickup",
    "Ship to Home",
    "Vendor Drop Shipping",
    "Locker Pickup",
    "Same-Day Delivery",
    "Curbside Pickup",
];

export const fulfillmentChannels = ["Online", "Retail Store", "Warehouse"];

export const chartTypeOptions = ["Bar", "Line", "Pie", "Table"];

export const getCommonChartOptions = ({
    type,
    isDark,
    labelColor,
    gridColor,
    categories,
    xAxisTitle = "Date",
}: {
    type: "bar" | "line" | "pie";
    isDark: boolean;
    labelColor: string;
    gridColor: string;
    categories: string[];
    xAxisTitle?: string;
}): ApexOptions => {
    const baseOptions: ApexOptions = {
        chart: {
            type,
            background: "transparent",
            foreColor: labelColor,
            toolbar: { show: false },
        },
        theme: {
            mode: isDark ? "dark" : "light",
        },
        legend: {
            labels: { colors: labelColor },
            position: "top",
        },
        grid: {
            borderColor: gridColor,
        },
        colors: ["#14b8a6", "#a855f7", "#db2777"],
        tooltip: {
            ...tooltipFormatter,
            theme: isDark ? "dark" : "light",
        },
        markers: {
            size: 4,
            hover: {
                size: 6,
            },
        },
    };

    if (type === "bar" || type === "line") {
        return {
            ...baseOptions,
            xaxis: {
                categories,
                labels: {
                    style: {
                        colors: Array(categories.length).fill(labelColor),
                    },
                    rotate: -45,
                    rotateAlways: true,
                },
                title: {
                    text: xAxisTitle,
                    style: { color: labelColor },
                },
                crosshairs: {
                    show: false,
                },
            },
            yaxis: {
                labels: {
                    style: { colors: labelColor },
                    formatter: formatUSD,
                },
                title: {
                    text: "Order Amount ($)",
                    style: { color: labelColor },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "60%",
                },
            },
            stroke: {
                show: true,
                width: 3,
                curve: "smooth",
            },
            dataLabels: { enabled: false },
        };
    }

    if (type === "pie") {
        return {
            ...baseOptions,
            labels: fulfillmentChannels,
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    colors: [isDark ? "#FFFFFF" : "#1e293b"],
                },
                formatter: (val: number) => `${val.toFixed(1)}%`,
            },
            tooltip: {
                ...usdTooltipFormatter,
                theme: isDark ? "dark" : "light",
            },
        };
    }

    return baseOptions;
};


export function getXAxisTitle(categories: string[]): string {
    if (categories.length === 0) return "Date";

    const first = new Date(categories[0]);
    const last = new Date(categories[categories.length - 1]);

    const diffMs = last.getTime() - first.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays <= 1) return "Date";
    if (diffDays <= 7) return "Dates";
    if (diffDays <= 30) return "Weeks";
    if (diffDays <= 365) return "Months";
    return "Years";
}
