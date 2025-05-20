import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import axios from "axios";
import { Toast } from 'primereact/toast';

const roleMappings: any[] = [
  { id: 1, role_level: "admin", department_id: null, identifier: "admin" },
  { id: 2, role_level: "manager", department_id: 1, identifier: "fulfillment_manager" },
  { id: 3, role_level: "manager", department_id: 2, identifier: "sales_manager" },
  { id: 4, role_level: "manager", department_id: 3, identifier: "inventory_manager" },
  { id: 5, role_level: "manager", department_id: 4, identifier: "shipments_manager" },
  { id: 6, role_level: "user", department_id: 1, identifier: "fulfillment_user" },
  { id: 7, role_level: "user", department_id: 2, identifier: "sales_user" },
  { id: 8, role_level: "user", department_id: 3, identifier: "inventory_user" },
  { id: 9, role_level: "user", department_id: 4, identifier: "shipments_user" },
];

const departmentMappings: any[] = [
  { id: 1, name: "fulfillment" },
  { id: 2, name: "sales" },
  { id: 3, name: "inventory" },
  { id: 4, name: "shipments" },
];

export const AddUser = ({  setUsers, editingUser, onClose }: any) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleLevel, setRoleLevel] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [errors, setErrors] = useState({ firstName: false, username: false, password: false });
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/me", { withCredentials: true })
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error("Failed to fetch current user:", err));
  }, []);

  useEffect(() => {
    if (editingUser) {
      setFirstName(editingUser.firstName || "");
      setLastName(editingUser.lastName || "");
      setUsername(editingUser.email || "");
    }
  }, [editingUser]);

  useEffect(() => {
    // Pre-set department if manager
    if (currentUser?.roleLevel === "manager") {
      const dept = currentUser.department;
      const capitalized = dept.charAt(0).toUpperCase() + dept.slice(1);
      setDepartment(capitalized);
    }
  }, [currentUser]);

  const getRoleId = (): number | null => {
    const rl = roleLevel?.toLowerCase();
    const dept = department?.toLowerCase() ?? null;
    const departmentId = departmentMappings.find((d) => d.name.toLowerCase() === dept)?.id ?? null;
    const match = roleMappings.find(
      (r) => r.role_level === rl && (r.department_id === departmentId || r.department_id === null)
    );
    return match?.id ?? null;
  };

const handleSubmit = async () => {
  const validationErrors = {
    firstName: firstName.trim() === "",
    username: username.trim() === "",
    password: editingUser ? false : password.trim() === "",
  };
  setErrors(validationErrors);
  if (Object.values(validationErrors).some((e) => e)) return;

  const roleId = getRoleId();
  if (!roleId) {
    toast.current?.show({
      severity: 'warn',
      summary: 'Role Mapping',
      detail: 'Role mapping not found. Please select a valid role level and department.',
      life: 3000,
    });
    return;
  }

  const roleObj = roleMappings.find((r) => r.id === roleId);
  const departmentId = roleObj?.department_id;

  const payload = {
    firstName: firstName.trim(),
    email: username.trim().toLowerCase(),
    password: password.trim(),
    role: roleObj ? { id: roleObj.id } : null,
    department: departmentId ? { id: departmentId } : null,
  };

  try {
    setLoading(true);
    const response = await axios.post("http://localhost:8080/api/auth/register", payload, {
      withCredentials: true,
    });

    const createdUser = response.data;

    setUsers((prev: any) => [
      ...prev,
      {
        ...createdUser,
        username: `${firstName} ${lastName}`,
        role: roleObj?.identifier,
      },
    ]);

    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'User registered successfully!',
      life: 3000,
    });

    // Reset fields
    setFirstName("");
    setUsername("");
    setPassword("");
    setRoleLevel(null);
    setDepartment(null);
    setErrors({ firstName: false, username: false, password: false });

    if (onClose) onClose();

  } catch (err) {
    console.error("Registration failed:", err);
    const errorMessage = axios.isAxiosError(err)
      ? err.response?.data?.message || "Failed to register user."
      : "Unexpected error occurred.";

    toast.current?.show({
      severity: 'error',
      summary: 'Registration Failed',
      detail: errorMessage,
      life: 3000,
    });
  } finally {
    setLoading(false);
  }
};



  // ↓ Filter Role Options Based on Logged-In User
  const filteredRoleLevels =
    currentUser?.roleLevel === "admin" ? ["Admin", "Manager", "User"] : ["User"];

  // ↓ Filter Department Options
  const filteredDepartments = currentUser?.roleLevel === "admin"
    ? departmentMappings.map((d) => d.name.charAt(0).toUpperCase() + d.name.slice(1))
    : currentUser?.department
      ? [currentUser.department.charAt(0).toUpperCase() + currentUser.department.slice(1)]
      : [];


  return (
    <>
    <Toast ref={toast} />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          First Name<span className="text-red-500">*</span>
        </label>
        <InputText value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full text-xs" />
        {errors.firstName && <p className="text-red-500 text-xs mt-1">First name is required</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Email (Username)<span className="text-red-500">*</span>
        </label>
        <InputText value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="w-full text-xs" />
        {errors.username && <p className="text-red-500 text-xs mt-1">Email is required</p>}
      </div>

      {!editingUser && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Password<span className="text-red-500">*</span>
          </label>
          <InputText type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-xs" />
          {errors.password && <p className="text-red-500 text-xs mt-1">Password is required</p>}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Role Level</label>
        <Dropdown value={roleLevel} onChange={(e) => setRoleLevel(e.value)} options={filteredRoleLevels} placeholder="Select Role Level" className="w-full text-xs" />
      </div>

      {roleLevel?.toLowerCase() !== "admin" && roleLevel !== null && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
          <Dropdown value={department} onChange={(e) => setDepartment(e.value)} options={filteredDepartments} placeholder="Select Department" className="w-full text-xs" />
        </div>
      )}


      <div className="col-span-full mt-2">
        <Button
          label={loading ? "Processing..." : editingUser ? "Update" : "Add User"}
          disabled={loading}
          className="bg-purple-700 text-white text-xs px-6 py-2 rounded shadow hover:bg-purple-800"
          onClick={handleSubmit}
        />
      </div>
    </div>
    </>
  );
};
