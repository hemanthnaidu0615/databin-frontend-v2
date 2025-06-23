import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { axiosInstance } from "../../../axios";

const roleMappings: any[] = [
  { id: 1, role_level: "admin", department_id: null, identifier: "admin" },
  {
    id: 2,
    role_level: "manager",
    department_id: 1,
    identifier: "fulfillment_manager",
  },
  {
    id: 3,
    role_level: "manager",
    department_id: 2,
    identifier: "sales_manager",
  },
  {
    id: 4,
    role_level: "manager",
    department_id: 3,
    identifier: "inventory_manager",
  },
  {
    id: 5,
    role_level: "manager",
    department_id: 4,
    identifier: "shipments_manager",
  },
  {
    id: 6,
    role_level: "user",
    department_id: 1,
    identifier: "fulfillment_user",
  },
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

export const AddUser = ({ setUsers, editingUser, onClose }: any) => {
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useRef<Toast>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    axiosInstance
      .get("auth/me", { withCredentials: true })
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
    if (currentUser?.roleLevel === "manager") {
      const dept = currentUser.department;
      const capitalized = dept.charAt(0).toUpperCase() + dept.slice(1);
      setDepartment(capitalized);
    }
  }, [currentUser]);

  const getRoleId = (): number | null => {
    const rl = roleLevel?.toLowerCase();
    const dept = department?.toLowerCase() ?? null;
    const departmentId =
      departmentMappings.find((d) => d.name.toLowerCase() === dept)?.id ?? null;
    const match = roleMappings.find(
      (r) =>
        r.role_level === rl &&
        (r.department_id === departmentId || r.department_id === null)
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
        severity: "warn",
        summary: "Role Mapping",
        detail:
          "Role mapping not found. Please select a valid role level and department.",
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
      const response = await axiosInstance.post("auth/register", payload);
      const createdUser = response.data;

      setUsers((prev: any) => [
        ...prev,
        {
          ...(typeof createdUser === "object" && createdUser !== null
            ? createdUser
            : {}),
          username: `${firstName} ${lastName}`,
          role: roleObj?.identifier,
        },
      ]);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "User registered successfully!",
        life: 3000,
      });

      setFirstName("");
      setUsername("");
      setPassword("");
      setRoleLevel(null);
      setDepartment(null);
      setErrors({ firstName: false, username: false, password: false });

      if (onClose) onClose();
    } catch (err) {
      console.error("Registration failed:", err);
      let errorMessage = "Unexpected error occurred.";

      if (
        typeof err === "object" &&
        err !== null &&
        "isAxiosError" in err &&
        (err as any).isAxiosError === true
      ) {
        const axiosErr = err as any;
        errorMessage =
          axiosErr.response?.data?.message || "Failed to register user.";
      }

      toast.current?.show({
        severity: "error",
        summary: "Registration Failed",
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRoleLevels =
    currentUser?.roleLevel === "admin"
      ? ["Admin", "Manager", "User"]
      : ["User"];

  const filteredDepartments =
    currentUser?.roleLevel === "admin"
      ? departmentMappings.map(
          (d) => d.name.charAt(0).toUpperCase() + d.name.slice(1)
        )
      : currentUser?.department
      ? [
          currentUser.department.charAt(0).toUpperCase() +
            currentUser.department.slice(1),
        ]
      : [];

  return (
    <>
      <Toast ref={toast} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-s font-medium text-gray-700 dark:text-white dark:bg-gray-800 mb-1"
          >
            Name<span className="text-red-500">*</span>
          </label>
          <InputText
            id="firstName"
            data-testid="first-name-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full text-xs"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">First name is required</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-s font-medium text-gray-700 dark:text-white dark:bg-gray-800 mb-1"
          >
            Email<span className="text-red-500">*</span>
          </label>
          <InputText
            id="email"
            data-testid="email-input"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className="w-full text-xs"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">Email is required</p>
          )}
        </div>

        {/* Password */}
        {!editingUser && (
          <div>
            <label
              htmlFor="password"
              className="block text-s font-medium text-gray-700 dark:text-white dark:bg-gray-800 mb-1"
            >
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <InputText
                id="password"
                data-testid="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pr-10"
              />
              <i
                className={`pi ${
                  showPassword ? "pi-eye-slash" : "pi-eye"
                } absolute right-4 top-3.5 text-gray-500 cursor-pointer`}
                onClick={() => setShowPassword((prev) => !prev)}
                data-testid="toggle-password-visibility"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">Password is required</p>
            )}
          </div>
        )}

        {/* Role Level */}
        <div>
          <label
            htmlFor="roleLevel"
            className="block text-s font-medium text-gray-700 dark:text-white dark:bg-gray-800 mb-1"
          >
            Role Level<span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="roleLevel"
            data-testid="role-level-dropdown"
            value={roleLevel}
            onChange={(e) => setRoleLevel(e.value)}
            options={filteredRoleLevels}
            placeholder="Select Role Level"
            className="w-full text-xs"
          />
        </div>

        {/* Department - only if not admin */}
        {roleLevel?.toLowerCase() !== "admin" && roleLevel !== null && (
          <div>
            <label
              htmlFor="department"
              className="block text-s font-medium text-gray-700 dark:text-white dark:bg-gray-800 mb-1"
            >
              Department<span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="department"
              data-testid="department-dropdown"
              value={department}
              onChange={(e) => setDepartment(e.value)}
              options={filteredDepartments}
              placeholder="Select Department"
              className="w-full text-xs"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="col-span-full mt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            data-testid="submit-button"
            className={`
          px-4 py-2 rounded 
          bg-[#9614d0]  text-sm text-white 
          hover:bg-[#a855f7] transition
          border-0 shadow-none outline-none
          focus:ring-0 focus:outline-none
          disabled:opacity-50
        `}
          >
            {loading ? "Processing..." : editingUser ? "Update" : "Add User"}
          </button>
        </div>
      </div>
    </>
  );
};