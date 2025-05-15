import { useState,useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { AddUser } from "./AddUser";
import axios from "axios";


export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([
    
  ]);

  const [editUser, setEditUser] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/auth/users", {
        withCredentials: true, // ensures cookies (JWT) are sent
      });

      const formattedUsers = response.data.map((user: any) => ({
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

  
//   const handleDelete = (userId: string) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
// 
//     setUsers((prev) => prev.filter((u) => u.id !== userId));
//   };
// 
//   const handleEdit = (user: any) => {
//     setEditUser(user);
//     setShowEditDialog(true);
//   };

  // const actionBody = (rowData: any) => (
  //   <div className="flex gap-2">
  //     <Button
  //       icon="pi pi-pencil"
  //       className="p-button-rounded p-button-info p-button-sm"
  //       onClick={() => handleEdit(rowData)}
  //       tooltip="Edit"
  //       tooltipOptions={{ position: "top" }}
  //     />
  //     <Button
  //       icon="pi pi-trash"
  //       className="p-button-rounded p-button-danger p-button-sm"
  //       onClick={() => handleDelete(rowData.id)}
  //       tooltip="Delete"
  //       tooltipOptions={{ position: "top" }}
  //     />
  //   </div>
  // );

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">
          User Management
        </h2>

        <div className="bg-white rounded-lg shadow-md p-4">
          <AddUser
            users={users}
            setUsers={setUsers}
            editingUser={null}
            onClose={() => {}}
          />
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <DataTable
            value={users}
            className="mt-4"
            stripedRows
            paginator
            rows={5}
            responsiveLayout="scroll"
          >
            <Column
              field="username"
              header="Username"
              sortable
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="email"
              header="Email"
              sortable
              style={{ minWidth: "16rem" }}
            />
            <Column
              field="role"
              header="Role Identifier"
              sortable
              style={{ minWidth: "12rem" }}
            />
            {/* <Column
              body={actionBody}
              header="Actions"
              style={{ minWidth: "8rem" }}
            /> */}
          </DataTable>
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
