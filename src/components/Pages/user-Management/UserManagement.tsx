import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { AddUser } from "./AddUser";
import { axiosInstance } from "../../../axios";

/* 1. Breakpoint hook */
const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);

  return isMobile;
};

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const isMobile = useIsMobile();

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const pageUsers = users.slice(first, first + rows);

  const handlePageChange = ({
    first,
    rows,
  }: {
    first: number;
    rows: number;
  }) => {
    setFirst(first);
    setRows(rows);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/users", {
          withCredentials: true,
        });

        setUsers(
          (data as any[]).map((u) => ({
            id: u.id,
            username: u.username || u.name || u.email.split("@")[0],
            rawUsername: u.username || "",
            email: u.email,
            role: u.role?.identifier || u.role?.roleLevel || "user",
          }))
        );
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className=" dark:from-gray-900 dark:to-gray-800 min-h-screen text-gray-900 dark:text-gray-100">
      <div className=" mx-auto">
        <h2 className="app-section-title mb-4">User Management</h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <AddUser
            users={users}
            setUsers={setUsers}
            editingUser={null}
            onClose={() => {}}
          />
        </div>

        <div className="mt-6 rounded-lg shadow-md p-4">
          {/* ✅ MOBILE CARDS + PAGINATION */}
          {isMobile ? (
            <>
              <ul className="space-y-4">
                {pageUsers.map((u) => (
                  <li
                    key={u.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {u.username}
                      </h3>
                    </div>

                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <div className="flex items-center gap-2">
                        <i className="pi pi-envelope text-sm" />
                        <span className="break-all">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="pi pi-user text-sm" />
                        <span>{u.role}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 🔻 Pagination Controls */}
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
                    Page {Math.floor(first / rows) + 1} of{" "}
                    {Math.ceil(users.length / rows)}
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
                      handlePageChange({
                        first: Math.max(0, first - rows),
                        rows,
                      })
                    }
                    disabled={first === 0}
                    className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      handlePageChange({
                        first:
                          first + rows < users.length ? first + rows : first,
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
            </>
          ) : (
            /* ✅ TABLE for tablets & laptops */
            <DataTable
              value={users}
              stripedRows
              paginator
              rows={5}
              responsiveLayout="stack"
              breakpoint="960px"
              className="w-full overflow-x-auto"
            >
              <Column
                field="username"
                header="Username"
                sortable
                style={{ minWidth: "12rem" }}
                className="app-table-content"
              />
              <Column
                field="email"
                header="Email"
                sortable
                style={{ minWidth: "16rem" }}
                className="app-table-content"
              />
              <Column
                field="role"
                header="Role Identifier"
                sortable
                style={{ minWidth: "12rem" }}
                className="app-table-content"
              />
            </DataTable>
          )}
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
