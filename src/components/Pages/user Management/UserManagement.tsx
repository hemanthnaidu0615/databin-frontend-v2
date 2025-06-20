import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { AddUser } from "./AddUser";
import { axiosInstance } from "../../../axios";

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/auth/users", {
          withCredentials: true,
        });

        const usersData = response.data as any[];
        const formattedUsers = usersData.map((user: any) => ({
          id: user.id,
          username: user.username || user.name || user.email.split("@")[0],
          email: user.email,
          role: user.role?.identifier || user.role?.roleLevel || "user",
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handlePageChange = ({ first, rows }: { first: number; rows: number }) => {
    setFirst(first);
    setRows(rows);
  };

  const paginatedUsers = users.slice(first, first + rows);

  return (
    <div className="bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 w-full h-full overflow-hidden">
      <div className="w-full">
        <h2 className="app-section-title mb-4">User Management</h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <AddUser users={users} setUsers={setUsers} editingUser={null} onClose={() => { }} />
        </div>

        {/* Desktop Table */}
        <div className="mt-6 app-table-heading rounded-lg shadow-md p-4 hidden lg:block">
          <DataTable
            value={users}
            className="mt-4"
            stripedRows
            paginator
            rows={5}
            responsiveLayout="scroll"
          >
            <Column field="username" header="Username" sortable style={{ minWidth: "12rem" }} />
            <Column field="email" header="Email" sortable style={{ minWidth: "16rem" }} />
            <Column field="role" header="Role Identifier" sortable style={{ minWidth: "12rem" }} />
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