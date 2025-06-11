import { Button } from "primereact/button";
import { useState } from "react";

export default function Table({ users, setUsers }: any) {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<any>({});

  const handleDelete = (id: number) => {
    const filtered = users.filter((user: any) => user.id !== id);
    setUsers(filtered);
  };

  const handleEdit = (user: any) => {
    setEditingUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleSave = () => {
    const fullName = `${editedUser.firstName} ${editedUser.lastName}`;

    const updatedUsers = users.map((user: any) =>
      user.id === editingUserId ? { ...user, name: fullName, email: editedUser.email, role: editedUser.role } : user
    );
    setUsers(updatedUsers);
    setEditingUserId(null);
    setEditedUser({});
  };

  return (
    <div className="overflow-x-auto p-4 bg-white shadow rounded-lg">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead className="bg-purple-100 text-xs font-semibold text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">First Name</th>
            <th className="px-4 py-2 text-left">Last Name</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => {
            const [firstName, ...rest] = user.name.split(" ");
            const lastName = rest.join(" ");
            return (
              <tr key={user.id} className="bg-white shadow-sm rounded-md text-xs">
                <td className="px-4 py-2">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editedUser.firstName || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    firstName
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editedUser.lastName || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    lastName
                  )}
                </td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">
                  {editingUserId === user.id ? (
                    <input
                      type="email"
                      value={editedUser.email || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingUserId === user.id ? (
                    <select
                      value={editedUser.role || user.role}
                      onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {editingUserId === user.id ? (
                    <Button
                      label="Save"
                      icon="pi pi-check"
                      className="p-button-sm p-button-success"
                      onClick={handleSave}
                    />
                  ) : (
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-sm p-button-warning"
                      onClick={() => handleEdit(user)}
                    />
                  )}
                  <Button
                    icon="pi pi-trash"
                    className="p-button-sm p-button-danger"
                    onClick={() => handleDelete(user.id)}
                  />
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-sm py-4 text-gray-500">
                No users available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}