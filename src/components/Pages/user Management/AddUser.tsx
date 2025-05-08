import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const roleMappings: any[] = [
  { id: 1, role_level: "admin", department_id: null, identifier: "admin", pages_permission: ["*"] },
  { id: 2, role_level: "manager", department_id: 1, identifier: "sales_manager", pages_permission: ["sales_dashboard", "orders", "revenue"] },
  { id: 3, role_level: "manager", department_id: 2, identifier: "returns_manager", pages_permission: ["returns_dashboard", "refunds"] },
  { id: 4, role_level: "manager", department_id: 3, identifier: "marketing_manager", pages_permission: ["campaigns", "ads_dashboard"] },
  { id: 5, role_level: "manager", department_id: 4, identifier: "inventory_manager", pages_permission: ["inventory_dashboard", "stock_control"] },
  { id: 6, role_level: "manager", department_id: 5, identifier: "care_manager", pages_permission: ["customer_queries", "tickets_dashboard"] },
  { id: 7, role_level: "user", department_id: 1, identifier: "sales_user", pages_permission: ["sales_dashboard"] },
  { id: 8, role_level: "user", department_id: 2, identifier: "returns_user", pages_permission: ["returns_dashboard"] },
  { id: 9, role_level: "user", department_id: 3, identifier: "marketing_user", pages_permission: ["campaigns"] },
  { id: 10, role_level: "user", department_id: 4, identifier: "inventory_user", pages_permission: ["inventory_dashboard"] },
  { id: 11, role_level: "user", department_id: 5, identifier: "care_user", pages_permission: ["customer_queries"] },
];

// Mapping departments to department_id
const departmentMappings: any[] = [
  { name: "Sales", id: 1 },
  { name: "Returns", id: 2 },
  { name: "Marketing", id: 3 },
  { name: "Inventory", id: 4 },
  { name: "CustomerCare", id: 5 },
];

export const AddUser = ({ users, setUsers, editingUser, onClose }: any) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleLevel, setRoleLevel] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    firstName: false,
    username: false,
    password: false,
  });

  const roleLevels = ["Admin", "Manager", "User"];
  const departments = ["Sales", "Returns", "Marketing", "Inventory", "CustomerCare"];

  useEffect(() => {
    if (editingUser) {
      setFirstName(editingUser.firstName || "");
      setLastName(editingUser.lastName || "");
      setUsername(editingUser.email || "");
    }
  }, [editingUser]);

  const getRoleId = () => {
    const rl = roleLevel?.toLowerCase(); // Ensure role is lowercase
    const dept = department?.toLowerCase() ?? null; // Ensure department is lowercase
  
    // Map department name to department_id
    const departmentId = departmentMappings.find((d) => d.name.toLowerCase() === dept)?.id ?? null;
  
    console.log("Mapped departmentId:", departmentId); // Debugging statement
  
    const match = roleMappings.find(
      (r) => r.role_level === rl && (r.department_id === departmentId || r.department_id === null)
    );
    console.log("match:", match); // Debugging statement
  
    return match?.id ?? null;
  };
  
  const getRoleIdentifier = () => {
    const rl = roleLevel?.toLowerCase(); // Ensure role is lowercase
    const dept = department?.toLowerCase() ?? null; // Ensure department is lowercase
  
    // Map department name to department_id
    const departmentId = departmentMappings.find((d) => d.name.toLowerCase() === dept)?.id ?? null;
  
    console.log("Mapped departmentId:", departmentId); // Debugging statement
  
    const match = roleMappings.find(
      (r) => r.role_level === rl && (r.department_id === departmentId || r.department_id === null)
    );
    console.log("match:", match); // Debugging statement
  
    return match?.identifier ?? null;
  };

  const handleSubmit = async () => {
    const validationErrors = {
      firstName: firstName.trim() === "",
      username: username.trim() === "",
      password: editingUser ? false : password.trim() === "",
    };
  
    setErrors(validationErrors);
  
    if (Object.values(validationErrors).some((e) => e)) return;
  
    try {
      const roleId = getRoleId();
      const roleIdentifier = getRoleIdentifier();
      const departmentName = department?.toLowerCase(); // Ensure department is lowercase
  
      if (!roleId || !roleIdentifier) {
        alert("Invalid role configuration.");
        return;
      }
  
      const payload = {
        email: username.toLowerCase(), // Ensure username is lowercase
        password: password,
        role: roleIdentifier, // Send the role identifier to the backend
        department: roleLevel === "Admin" ? null : departmentName, 
        // Send department name or null for Admin
      };
  
      console.log("Payload being sent:", payload); // Log the payload for debugging
  
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log("Backend response:", result); // Log the response from the backend
  
      if (!response.ok) {
        alert(`Error: ${result.message || "Something went wrong!"}`);
        return;
      }
  
      const savedUser = result;
  
      const newUser = {
        id: savedUser.id,
        name: `${firstName} ${lastName}`,
        username: `${firstName} ${lastName}`,
        email: savedUser.email,
        role: roleIdentifier,
      };
  
      setUsers((prev: any) => [...prev, newUser]);
  
      // Reset form after success
      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");
      setRoleLevel(null);
      setDepartment(null);
      setErrors({ firstName: false, username: false, password: false });
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to submit user:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          First Name<span className="text-red-500">*</span>
        </label>
        <InputText value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full text-xs" />
        {errors.firstName && <p className="text-red-500 text-xs mt-1">First name is required</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
        <InputText value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full text-xs" />
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
        <Dropdown value={roleLevel} onChange={(e) => setRoleLevel(e.value)} options={roleLevels} placeholder="Select Role Level" className="w-full text-xs" />
      </div>

      {roleLevel !== "Admin" && roleLevel !== null && (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
    <Dropdown
      value={department}
      onChange={(e) => setDepartment(e.value)}
      options={departments}
      placeholder="Select Department"
      className="w-full text-xs"
    />
  </div>
)}

      <div className="col-span-full mt-2">
        <Button label={editingUser ? "Update" : "Add User"} className="bg-purple-700 text-white text-xs px-6 py-2 rounded shadow hover:bg-purple-800" onClick={handleSubmit} />
      </div>
    </div>
  );
};
