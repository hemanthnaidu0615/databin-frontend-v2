import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import "primeicons/primeicons.css";
import { axiosInstance } from "../../axios";
import CommonButton from "../modularity/buttons/Button";
import { FaTable } from "react-icons/fa";
import { TableColumn } from "../modularity/tables/BaseDataTable";
import FilteredDataDialog from "../modularity/tables/FilteredDataDialog";

interface ProductData {
  id: number;
  product_name: string;
  price: number;
  description: string;
  quantity: number;
}
const tableColumns: TableColumn<ProductData>[] = [
  { field: "product_name", header: "Product", filter: true, sortable: true },
  { field: "description", header: "Description", filter: true, sortable: true },
  { field: "quantity", header: "Qty Sold", filter: true, sortable: true },
  {
    field: "price",
    header: "Price (USD)",
    filter: true,
    sortable: true,
    body: (row: ProductData) => <span>{formatUSD(convertToUSD(row.price))}</span>,
  },
];


const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

function convertToUSD(rupees: number): number {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const ProfitabilityTable: React.FC = () => {
  const { theme } = useTheme();
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [position, setPosition] = useState(1);
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const navigate = useNavigate();

  const [showGridModal, setShowGridModal] = useState(false);
  const [, setGridTotalRecords] = useState(0);
  const [gridPage] = useState(0);
  const [gridRows] = useState(10);
  const [gridSortField] = useState<string | undefined>(undefined);
  const [gridSortOrder] = useState<number | undefined>(undefined);
  const [, setLoadingGrid] = useState(false);

  const handleViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/orders");
  };

  const moveLeft = () =>
    setPosition((prev) => (prev === 1 ? productData.length : prev - 1));
  const moveRight = () =>
    setPosition((prev) => (prev === productData.length ? 1 : prev + 1));

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const params: Record<string, string | number> = {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          size: 10,
        };

        if (enterpriseKey) {
          params.enterpriseKey = enterpriseKey;
        }

        const response = await axiosInstance.get("/top-sellers/top-products", {
          params,
        });
        const json = response.data as { data?: any[] };

        if (json.data && Array.isArray(json.data)) {
          const transformed = json.data.map((product: any, index: number) => ({
            id: index + 1,
            product_name: product.product_name,
            price: parseFloat(product.price ?? 0),
            description: product.description ?? "No description available",
            quantity: product.quantity ?? 0,
          }));

          setProductData(transformed);
          setPosition(1);
        }
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      }
    };

    if (startDate && endDate) {
      fetchTopProducts();
    }
  }, [startDate, endDate, enterpriseKey]);

  useEffect(() => {
    if (!showGridModal) return;

    const fetchGridData = async () => {
      setLoadingGrid(true);
      try {
        const params: Record<string, any> = {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          page: gridPage,
          size: gridRows,
        };

        if (enterpriseKey) params.enterpriseKey = enterpriseKey;
        if (gridSortField) params.sortField = gridSortField;
        if (gridSortOrder !== undefined) {
          params.sortOrder = gridSortOrder === 1 ? "asc" : "desc";
        }

        const response = await axiosInstance.get("/top-sellers/top-products", {
          params,
        });
        const json = response.data as { data?: any[]; count?: number };

        if (json.data && Array.isArray(json.data)) {
          setGridTotalRecords(json.count ?? 0);
        }
      } catch (error) {
        console.error("Failed to fetch grid products:", error);
      }
      setLoadingGrid(false);
    };

    fetchGridData();
  }, [
    showGridModal,
    gridPage,
    gridRows,
    gridSortField,
    gridSortOrder,
    startDate,
    endDate,
    enterpriseKey,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productData.length]);

  useEffect(() => {
    const interval = setInterval(() => moveRight(), 5000);
    return () => clearInterval(interval);
  }, [productData.length]);

  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY) {
      window.scrollTo({ top: parseInt(scrollY), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);
  // Add a type for filter objects
  type FilterObj = { value?: any; matchMode?: string };

  const fetchTopSellingProducts = async ({
    page,
    size,
    sortField,
    sortOrder,
    filters = {},
    ...restParams
  }: {
    page: number;
    size: number;
    sortField?: string;
    sortOrder?: number;
    filters?: Record<string, FilterObj>;
    [key: string]: any;
  }) => {
    const params: any = {
      page,
      size,
      sortField,
      sortOrder: sortOrder === 1 ? "asc" : "desc",
      ...restParams,
    };

    for (const [col, filterObj] of Object.entries(filters)) {
      if (filterObj?.value) {
        params[`${col}.value`] = filterObj.value;
        params[`${col}.matchMode`] = filterObj.matchMode || "contains";
      }
    }

    const res = await axiosInstance.get("/top-sellers/top-products", { params });

    const data = res.data as { data: any[]; count: number };

    const transformedData: ProductData[] = data.data.map((product: any, index: number) => ({
      id: index + 1,
      product_name: product.product_name,
      description: product.description ?? "No description available",
      quantity: product.quantity ?? 0,
      price: parseFloat(product.price ?? 0),
    }));

    return {
      data: transformedData,
      count: data.count,
    };
  };


  const renderMobileCard = (product: ProductData, index: number) => (
    <div key={index} className="mb-3 p-3 border rounded shadow-sm bg-white dark:bg-gray-800">
      <div className="font-semibold">{product.product_name}</div>
      <div className="text-sm">{product.description}</div>
      <div className="text-xs text-gray-500">Qty: {product.quantity.toLocaleString()}</div>
      <div className="text-xs text-gray-500">Price: {formatUSD(convertToUSD(product.price))}</div>
    </div>
  );



  return (
    <div className="overflow-visible rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md p-4 w-full relative min-h-[400px] sm:p-5">
      {/* Header */}
      <div className="flex justify-between items-start sm:items-center flex-wrap sm:flex-nowrap gap-2 mb-4">
        <div className="flex items-start justify-between w-full sm:w-auto">
          <h2 className="app-subheading flex-1 mr-2">Top Selling products</h2>

          {/* Mobile arrow (→) aligned right */}
          <CommonButton variant="responsive" onClick={handleViewMore} showDesktop={false} />
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop & tablet "View More" */}
          <CommonButton
            variant="responsive"
            onClick={handleViewMore}
            showMobile={false}
            text="View more"
          />

          {/* Grid view button */}
          <button
            onClick={() => setShowGridModal(true)}
            aria-label="Show grid view"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 rounded-lg dark:border-purple-400"
            title="Show Grid View"
          >
            <FaTable size={18} />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="w-full max-w-full overflow-hidden relative carousel-container">
        {/* Edge Fade */}
        <div className="absolute left-0 top-0 w-6 h-full bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-6 h-full bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

        <div
          className="relative flex items-center justify-center w-full h-[380px] pt-2"
          style={{ perspective: "600px" }}
        >
          {/* Arrows (Desktop Only) */}
          {productData.length > 1 && (
            <>
              <button
                onClick={moveLeft}
                className="flex absolute left-2 top-1/2 -translate-y-1/2 z-[200] bg-black/50 text-white rounded-full w-8 h-8 items-center justify-center hover:bg-black/70 transition"
                aria-label="Previous"
              >
                <i className="pi pi-chevron-left text-base" />
              </button>
              <button
                onClick={moveRight}
                className="flex absolute right-2 top-1/2 -translate-y-1/2 z-[200] bg-black/50 text-white rounded-full w-8 h-8 items-center justify-center hover:bg-black/70 transition"
                aria-label="Next"
              >
                <i className="pi pi-chevron-right text-base" />
              </button>
            </>
          )}

          {/* Cards */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {productData.map((product, i) => {
              const offset = i + 1;
              const r = offset - position;
              const abs = Math.abs(r);
              const scale = abs === 0 ? 1.03 : 1 - abs * 0.04;
              const rotateY = -r * 15;
              const translateX = r * 100;
              const opacity = abs > 4 ? 0 : 1;

              return (
                <div
                  key={product.id}
                  onClick={() => setPosition(offset)}
                  className={`cursor-pointer absolute w-[90%] max-w-[220px] h-[280px] flex flex-col justify-between items-center p-3 rounded-2xl border text-center shadow-lg bg-white dark:bg-gray-800 ${abs === 0 ? "scale-105 transition-transform duration-300 ease-out" : ""
                    }`}
                  style={{
                    transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex: 100 - abs,
                    opacity,
                    border: `2px solid ${abs === 0 ? "#a855f7" : "#8417b2"}`,
                    boxShadow: `0 0 10px ${abs === 0 ? "#a855f7" : "#8417b2"}40`,
                    pointerEvents: abs > 2 ? "none" : "auto",
                    transition:
                      "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease-out, border 0.3s ease-out, box-shadow 0.3s ease-out",
                  }}
                >
                  <span
                    className={`absolute top-2 left-2 text-4xl font-extrabold select-none pointer-events-none ${abs === 0
                      ? "text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text drop-shadow-[0_0_8px_rgba(150,20,208,0.5)]"
                      : "text-purple-600 opacity-30"
                      }`}
                  >
                    #{i + 1}
                  </span>

                  <div className="mt-20 w-full">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {product.product_name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 whitespace-normal break-words">
                      {product.description.length > 100
                        ? product.description.slice(0, 100) + "..."
                        : product.description}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-400">
                      Quantity Sold: {product.quantity.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-400">
                      Price: {formatUSD(convertToUSD(product.price))}
                    </p>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots (Mobile Only) */}
        <div className="flex justify-center gap-2 mt-3 z-50">
          {productData.map((_, index) => (
            <button
              key={index}
              onClick={() => setPosition(index + 1)}
              className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${position === index + 1
                ? "bg-purple-600 border-purple-600"
                : theme === "dark"
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-300 bg-white"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Grid Modal */}
      <FilteredDataDialog
        visible={showGridModal}
        onHide={() => setShowGridModal(false)}
        header="Top Selling Products – Details"
        columns={tableColumns}
        fetchData={(filterParams) => (tableParams) =>
          fetchTopSellingProducts({
            ...filterParams,
            ...tableParams,
          })
        }
        filterParams={{
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          enterpriseKey: enterpriseKey || undefined,
        }}
        mobileCardRender={renderMobileCard}
        width="80vw"
      />



    </div>
  );
};

export default ProfitabilityTable;
