import { useState, useEffect } from "react";
import { DataTable, DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { AddUser } from "./AddUser";
import { axiosInstance } from "../../../axios";

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    email: { value: null, matchMode: "contains" },
    role: { value: null, matchMode: "contains" },
    role_level: { value: null, matchMode: "contains" },
  });

  const [editUser, setEditUser] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size: rows,
        sortField,
        sortOrder,
      };

      for (const key in filters) {
        const value = filters[key]?.value;
        const matchMode = filters[key]?.matchMode;
        if (value && matchMode && key !== "global") {
          params[`${key}.value`] = value;
          params[`${key}.matchMode`] = matchMode;
        }
      }

      const response = await axiosInstance.get("/auth/users", {
        params,
        withCredentials: true,
      });

      const { data, count } = response.data;

      const formatted = (data || []).map((user: any) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        role_level: user.role_level,
        department: user.department,
        username: user.username || user.email?.split("@")[0],
      }));

      setUsers(formatted);
      setTotalRecords(count);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rows, sortField, sortOrder, filters]);

  const onPageChange = (e: DataTablePageEvent) => {
    setPage(e.page ?? 0);
    setRows(e.rows ?? 10);
  };

  const onSort = (e: DataTableSortEvent) => {
    setSortField(e.sortField ?? "id");
    setSortOrder(e.sortOrder === 1 ? "asc" : "desc");
  };

  const onFilter = (e: DataTableFilterEvent) => {
    setFilters(e.filters);
  };

  const renderFilterInput = (placeholder = "Search") => {
    return (options: any) => (
      <InputText
        value={options.value || ""}
        onChange={(e) => options.filterCallback(e.target.value)}
        placeholder={placeholder}
        className="p-column-filter"
      />
    );
  };

  // For mobile pagination
  const [first, setFirst] = useState(0);
  const paginatedUsers = users.slice(first, first + rows);

  const handlePageChange = ({ first, rows }: { first: number; rows: number }) => {
    setFirst(first);
    setRows(rows);
  };

  return (
    <div className="p-6 bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="app-section-title mb-4">User Management</h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <AddUser
            users={users}
            setUsers={setUsers}
            editingUser={null}
            onClose={() => {}}
          />
        </div>

        {/* Desktop Table */}
        <div className="mt-6 app-table-heading rounded-lg shadow-md p-4 hidden lg:block">
          <DataTable
            value={users}
            loading={loading}
            paginator
            lazy
            first={page * rows}
            rows={rows}
            totalRecords={totalRecords}
            sortMode="single"
            sortField={sortField}
            sortOrder={sortOrder === "asc" ? 1 : -1}
            onPage={onPageChange}
            onSort={onSort}
            onFilter={onFilter}
            filters={filters}
            globalFilterFields={["email", "role", "role_level"]}
            className="mt-4"
            stripedRows
            responsiveLayout="scroll"
          >
            <Column
              field="username"
              header="Username"
              sortable
              style={{ minWidth: "12rem" }}
              filter
              filterElement={renderFilterInput()}
            />
            <Column
              field="email"
              header="Email"
              sortable
              style={{ minWidth: "16rem" }}
              filter
              filterElement={renderFilterInput()}
            />
            <Column
              field="role"
              header="Role"
              sortable
              style={{ minWidth: "12rem" }}
              filter
              filterElement={renderFilterInput()}
            />
            <Column
              field="role_level"
              header="Role Level"
              sortable
              style={{ minWidth: "12rem" }}
              filter
              filterElement={renderFilterInput()}
            />
          </DataTable>
        </div>

        {/* Mobile Card View + Pagination */}
        <div className="lg:hidden mt-6 p-4 flex flex-col gap-4">
          {paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow"
            >
              <div className="text-lg font-semibold mb-1">{user.username}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                📧 {user.email}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                🛡 Role: {user.role}
              </div>
            </div>
          ))}

          {/* Mobile Pagination */}
          <div className="mt-4 text-sm text-gray-800 dark:text-gray-100">
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="mobileRows">Rows per page:</label>
                <select
                  id="mobileRows"
                  value={rows}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    setRows(r);
                    setFirst(0);
                  }}
                  className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 w-full border"
                >
                  {[5, 10, 15].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                Page {Math.floor(first / rows) + 1} of {Math.ceil(users.length / rows)}
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2">
              <button
                onClick={() => handlePageChange({ first: 0, rows })}
                disabled={first === 0}
                className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                ⏮ First
              </button>
              <button
                onClick={() =>
                  handlePageChange({ first: Math.max(0, first - rows), rows })
                }
                disabled={first === 0}
                className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  handlePageChange({
                    first: first + rows < users.length ? first + rows : first,
                    rows,
                  })
                }
                disabled={first + rows >= users.length}
                className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() =>
                  handlePageChange({
                    first: (Math.ceil(users.length / rows) - 1) * rows,
                    rows,
                  })
                }
                disabled={first + rows >= users.length}
                className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Last ⏭
              </button>
            </div>
          </div>
        </div>

        <Dialog
          header="Edit User"
          visible={showEditDialog}
          onHide={() => {
            setShowEditDialog(false);
            setEditUser(null);
          }}
          style={{ width: "60vw" }}
          className="p-fluid"
        >
          <AddUser
            users={users}
            setUsers={setUsers}
            editingUser={editUser}
            onClose={() => {
              setShowEditDialog(false);
              setEditUser(null);
            }}
          />
        </Dialog>
      </div>
    </div>
  );
};