"use client";

import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import moment from "moment";
import { BaseDataTable, TableColumn } from "../../modularity/tables/BaseDataTable";
import { axiosInstance } from "../../../axios";

interface Scheduler {
  title: string;
  description: string;
  email: string;
  start_date: string;
  recurrence_pattern: string;
  date_range_type: string | null;
}

const ViewScheduler: React.FC = () => {
  const [expandedStates, setExpandedStates] = useState<string[]>([]);

  const arrowExpand = (title: string) => {
    setExpandedStates((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const fetchData = async (params: any) => {
    const queryParams = new URLSearchParams({
      ...params,
      sortField: params.sortField || "start_date",
      sortOrder: params.sortOrder || "asc"
    });

    const url = `/schedulers/view?${queryParams.toString()}`;

    try {
      const response = await axiosInstance.get(url);
      const resp = response.data as { data: Scheduler[]; count: number };
      return {
        data: resp.data || [],
        count: resp.count || 0
      };
    } catch (error) {
      console.error("Error fetching schedulers:", error);
      return { data: [], count: 0 };
    }
  };

  const renderMobileCard = (item: Scheduler, index: number) => (
    <div key={index} className="mb-3">
      <div
        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer"
        onClick={() => arrowExpand(item.title)}
      >
        <div className="font-medium">{item.title}</div>
        {expandedStates.includes(item.title) ? (
          <FaChevronUp className="text-gray-500 dark:text-gray-400" />
        ) : (
          <FaChevronDown className="text-gray-500 dark:text-gray-400" />
        )}
      </div>

      {expandedStates.includes(item.title) && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="mb-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">Description</div>
            <div className="text-sm font-medium">{item.description}</div>
          </div>
          <div className="mb-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">Email</div>
            <div className="text-sm font-medium">{item.email}</div>
          </div>
          <div className="mb-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">Recurrence</div>
            <div className="text-sm font-medium">{item.recurrence_pattern}</div>
          </div>
          <div className="mb-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">Start Date</div>
            <div className="text-sm font-medium">
              {moment(item.start_date).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Time Frame</div>
            <div className="text-sm font-medium">{item.date_range_type}</div>
          </div>
        </div>
      )}
    </div>
  );

  const columns: TableColumn<Scheduler>[] = [
    { field: "title", header: "Title", sortable: true, filter: true },
    { field: "description", header: "Description", sortable: true, filter: true },
    { field: "email", header: "Email", sortable: true, filter: true },
    { field: "recurrence_pattern", header: "Recurrence", sortable: true, filter: true },
    {
      field: "start_date",
      header: "Start Date",
      sortable: true,
      body: (rowData: Scheduler) => moment(rowData.start_date).format("YYYY-MM-DD HH:mm")
    },
    { field: "date_range_type", header: "Time Frame", sortable: true, filter: true }
  ];

  return (
    <div className="card p-4">
      <BaseDataTable<Scheduler>
        columns={columns}
        fetchData={fetchData}
        title="View Scheduled Reports"
        mobileCardRender={renderMobileCard}
        initialSortField="start_date"
        initialRows={15}
        globalFilterFields={[
          "title",
          "description",
          "email",
          "recurrence_pattern",
          "start_date",
          "date_range_type"
        ]}
        rowsPerPageOptions={[10, 15, 20, 50]} field={"title"} header={""} />
    </div>
  );
};

export default ViewScheduler;