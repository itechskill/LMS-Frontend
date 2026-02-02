import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaTrash, FaKey, FaSearch, FaUserPlus, FaEye, FaTimes } from "react-icons/fa";
import { getAllUsers, deleteUser, updateUser, createUser, getCourses } from "../api/api";

// Exact Color Theme from Screenshot
const COLORS = {
  sidebarDark: "#1a1d2e",
  deepPurple: "#3D1A5B",
  headerPurple: "#4B2D7A",
  brightGreen: "#00D9A3",
  goldBadge: "#D4A745",
  roleBg: "#E8DFF5",
  white: "#FFFFFF",
  bgGray: "#F9FAFB",
  lightGray: "#F3F4F6",
  darkGray: "#6B7280",
  textGray: "#4B5563",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6"
};

// Modal Component
const Modal = ({ children, onClose }) => (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "16px",
  }}>
    <div style={{
      background: COLORS.white,
      padding: "24px",
      borderRadius: "12px",
      width: "100%",
      maxWidth: "500px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    }}>
      {children}
    </div>
  </div>
);

// Course Checkbox List
const CoursesCheckbox = ({ courses, selectedCourses, onToggle, disabled }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${COLORS.darkGray}`,
    padding: "12px",
    borderRadius: "8px",
    maxHeight: "150px",
    overflowY: "auto",
    background: COLORS.lightGray,
  }}>
    {courses.map(course => (
      <label
        key={course._id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          padding: "4px",
          color: disabled ? COLORS.darkGray : COLORS.textGray,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={selectedCourses.includes(course._id)}
            onChange={() => onToggle(course._id)}
            disabled={disabled}
            style={{
              accentColor: COLORS.deepPurple,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          />
          <span style={{ 
            fontWeight: selectedCourses.includes(course._id) ? "600" : "400",
          }}>
            {course.title}
          </span>
        </div>
      </label>
    ))}
  </div>
);

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Student",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    status: "Active",
    courses: [],
    country: "",
    dob: "",
    gender: "Male",
    selectDate: "",
  });

  // Responsive handling - matches Dashboard exactly
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch users!");
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : data.courses || []);
    } catch (error) {
      console.error(error);
      setCourses([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
      await fetchCourses();
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      role: "Student",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      status: "Active",
      courses: [],
      country: "",
      dob: "",
      gender: "Male",
      selectDate: "",
    });
    setFormVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "Student",
      phone: user.phone || "",
      address: user.address || "",
      password: "",
      confirmPassword: "",
      status: user.status || "Active",
      courses: user.courses?.map(c => c._id) || [],
      country: user.country || "",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      gender: user.gender || "Male",
      selectDate: user.selectDate ? new Date(user.selectDate).toISOString().split("T")[0] : "",
    });
    setFormVisible(true);
  };

  const handleShowDetails = (user) => setSelectedUser(user);
  const handleCloseDetails = () => setSelectedUser(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (courseId) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter(c => c !== courseId)
        : [...prev.courses, courseId]
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete user!");
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;
    try {
      await updateUser(userId, { password: newPassword });
      alert("Password reset successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to reset password!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser && formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    if (!formData.phone) {
      return alert("Phone number is required!");
    }

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        status: formData.status,
        courses: formData.courses,
        country: formData.country,
        dob: formData.dob,
        gender: formData.gender,
        selectDate: formData.selectDate,
      };

      if (!editingUser) payload.password = formData.password;

      if (editingUser) {
        await updateUser(editingUser._id, payload);
        alert("User updated successfully!");
      } else {
        await createUser(payload);
        alert("User created successfully!");
      }

      setFormVisible(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save user!");
    }
  };

  const getCourseNames = (userCourses) => {
    if (!Array.isArray(userCourses)) return [];
    return userCourses
      .map(c => (typeof c === "string" ? courses.find(cr => cr._id === c)?.title : c.title))
      .filter(Boolean);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const courseTitles = getCourseNames(user.courses).join(" ").toLowerCase();
      return (
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitles.includes(searchTerm.toLowerCase())
      );
    });
  }, [users, searchTerm, courses]);

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      
      {/* Main Content - Matches Dashboard exactly */}
      <div style={{
        ...styles.mainContent,
        marginLeft: isMobile ? "0" : "280px",
        paddingTop: isMobile ? "80px" : "32px",
        padding: isMobile ? "80px 16px 32px 16px" : "32px",
      }}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.pageTitle}>
                User Management
              </h1>
            </div>
            <div style={styles.liveDataBadge}>
              <p style={styles.liveDataText}>
                Total Users: {filteredUsers.length}
              </p>
            </div>
          </div>

          {/* Search & Add Button Row */}
          <div style={{ 
            display: "flex", 
            gap: isMobile ? "12px" : "20px",
            marginBottom: isMobile ? "24px" : "30px",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            {/* Search Input */}
            <div style={{
              position: "relative",
              flex: 1,
              maxWidth: isMobile ? "100%" : "650px"
            }}>
              <FaSearch style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.darkGray,
                fontSize: "16px"
              }} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  padding: isMobile ? "12px 16px 12px 48px" : "14px 16px 14px 48px", 
                  borderRadius: "8px", 
                  border: `1px solid #D1D5DB`,
                  width: "100%",
                  fontSize: "15px",
                  background: COLORS.white,
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
            
            {/* Add New User Button */}
            <button
              onClick={handleAdd}
              style={{ 
                background: COLORS.deepPurple, 
                color: COLORS.white, 
                border: "none", 
                padding: isMobile ? "12px 24px" : "14px 28px", 
                borderRadius: "8px", 
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                whiteSpace: "nowrap"
              }}
            >
              <FaUserPlus /> Add New User
            </button>
          </div>

          {/* Users Table */}
          <div style={{
            background: COLORS.white,
            borderRadius: "12px",
            overflow: isMobile ? "auto" : "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              minWidth: isMobile ? "800px" : "auto"
            }}>
              <thead>
                <tr style={{ 
                  background: COLORS.headerPurple,
                  color: COLORS.white
                }}>
                  <th style={{ 
                    padding: isMobile ? "14px 16px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "13px" : "15px", 
                    fontWeight: "700" 
                  }}>#</th>
                  <th style={{ 
                    padding: isMobile ? "14px 16px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "13px" : "15px", 
                    fontWeight: "700" 
                  }}>Name</th>
                  <th style={{ 
                    padding: isMobile ? "14px 16px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "13px" : "15px", 
                    fontWeight: "700" 
                  }}>Email</th>
                  <th style={{ 
                    padding: isMobile ? "14px 16px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "13px" : "15px", 
                    fontWeight: "700" 
                  }}>Role</th>
                  <th style={{ 
                    padding: isMobile ? "14px 16px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "13px" : "15px", 
                    fontWeight: "700" 
                  }}>Status</th>
                  <th style={{ 
                    padding: isMobile ? "14px 16px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "13px" : "15px", 
                    fontWeight: "700" 
                  }}>Phone</th>
                  <th style={{ 
                    padding: isMobile ? "14px 16px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "13px" : "15px", 
                    fontWeight: "700" 
                  }}>Courses</th>
                  <th style={{ 
                    padding: isMobile ? "14px 16px" : "18px 24px", 
                    textAlign: "center", 
                    fontSize: isMobile ? "13px" : "15px", 
                    fontWeight: "700" 
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id} style={{ 
                      borderBottom: `1px solid ${COLORS.lightGray}`,
                      background: index % 2 === 0 ? COLORS.white : COLORS.bgGray
                    }}>
                      <td style={{ 
                        padding: isMobile ? "14px 16px" : "18px 24px", 
                        color: COLORS.textGray, 
                        fontWeight: "600", 
                        fontSize: isMobile ? "13px" : "15px" 
                      }}>
                        {index + 1}
                      </td>
                      <td style={{ 
                        padding: isMobile ? "14px 16px" : "18px 24px", 
                        color: COLORS.deepPurple, 
                        fontWeight: "600", 
                        fontSize: isMobile ? "13px" : "15px" 
                      }}>
                        {user.fullName}
                      </td>
                      <td style={{ 
                        padding: isMobile ? "14px 16px" : "18px 24px", 
                        color: COLORS.textGray, 
                        fontSize: isMobile ? "13px" : "15px" 
                      }}>
                        {user.email}
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <span style={{
                          background: COLORS.roleBg,
                          color: COLORS.deepPurple,
                          padding: isMobile ? "4px 12px" : "6px 16px",
                          borderRadius: "6px",
                          fontSize: isMobile ? "12px" : "13px",
                          fontWeight: "600",
                          display: "inline-block"
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <span style={{
                          background: COLORS.brightGreen,
                          color: COLORS.white,
                          padding: isMobile ? "4px 12px" : "6px 16px",
                          borderRadius: "6px",
                          fontSize: isMobile ? "12px" : "13px",
                          fontWeight: "600",
                          display: "inline-block"
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ 
                        padding: isMobile ? "14px 16px" : "18px 24px", 
                        color: COLORS.textGray, 
                        fontSize: isMobile ? "13px" : "15px" 
                      }}>
                        {user.phone || "-"}
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {getCourseNames(user.courses).map((course, i) => (
                            <span key={i} style={{
                              background: COLORS.goldBadge,
                              color: "#3D2817",
                              padding: isMobile ? "3px 10px" : "5px 14px",
                              borderRadius: "6px",
                              fontSize: isMobile ? "11px" : "13px",
                              fontWeight: "600",
                              display: "inline-block"
                            }}>
                              {course}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? "6px" : "8px" }}>
                          <button 
                            onClick={() => handleShowDetails(user)} 
                            style={{ 
                              background: "#10B981", 
                              color: COLORS.white, 
                              border: "none", 
                              padding: isMobile ? "6px 8px" : "8px 10px", 
                              borderRadius: "6px", 
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <FaEye size={isMobile ? 12 : 14} />
                          </button>
                          <button 
                            onClick={() => handleEdit(user)} 
                            style={{ 
                              background: "#F59E0B", 
                              color: COLORS.white, 
                              border: "none", 
                              padding: isMobile ? "6px 8px" : "8px 10px", 
                              borderRadius: "6px", 
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <FaEdit size={isMobile ? 12 : 14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id)} 
                            style={{ 
                              background: "#EF4444", 
                              color: COLORS.white, 
                              border: "none", 
                              padding: isMobile ? "6px 8px" : "8px 10px", 
                              borderRadius: "6px", 
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <FaTrash size={isMobile ? 12 : 14} />
                          </button>
                          <button 
                            onClick={() => handleResetPassword(user._id)} 
                            style={{ 
                              background: "#3B82F6", 
                              color: COLORS.white, 
                              border: "none", 
                              padding: isMobile ? "6px 8px" : "8px 10px", 
                              borderRadius: "6px", 
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <FaKey size={isMobile ? 12 : 14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: COLORS.darkGray }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {formVisible && (
        <Modal onClose={() => setFormVisible(false)}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <button onClick={() => setFormVisible(false)} style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                color: COLORS.deepPurple,
                fontSize: "20px"
              }}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>
                  Full Name
                </label>
                <input 
                  name="fullName" 
                  placeholder="Full Name" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  required 
                  style={{ 
                    padding: "10px", 
                    borderRadius: "8px", 
                    border: `1px solid #D1D5DB`,
                    width: "100%",
                    boxSizing: "border-box",
                    fontSize: "14px"
                  }} 
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>
                  Email
                </label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  style={{ 
                    padding: "10px", 
                    borderRadius: "8px", 
                    border: `1px solid #D1D5DB`,
                    width: "100%",
                    boxSizing: "border-box",
                    fontSize: "14px"
                  }} 
                />
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>
                      Password
                    </label>
                    <input 
                      name="password" 
                      type="password" 
                      placeholder="Password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      required 
                      style={{ 
                        padding: "10px", 
                        borderRadius: "8px", 
                        border: `1px solid #D1D5DB`,
                        width: "100%",
                        boxSizing: "border-box",
                        fontSize: "14px"
                      }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>
                      Confirm Password
                    </label>
                    <input 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="Confirm Password" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      required 
                      style={{ 
                        padding: "10px", 
                        borderRadius: "8px", 
                        border: `1px solid #D1D5DB`,
                        width: "100%",
                        boxSizing: "border-box",
                        fontSize: "14px"
                      }} 
                    />
                  </div>
                </>
              )}

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>
                  Phone No
                </label>
                <input 
                  name="phone" 
                  placeholder="Phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  style={{ 
                    padding: "10px", 
                    borderRadius: "8px", 
                    border: `1px solid #D1D5DB`,
                    width: "100%",
                    boxSizing: "border-box",
                    fontSize: "14px"
                  }} 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>
                    Role
                  </label>
                  <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    style={{ 
                      padding: "10px", 
                      borderRadius: "8px", 
                      border: `1px solid #D1D5DB`,
                      width: "100%",
                      boxSizing: "border-box",
                      fontSize: "14px",
                      background: COLORS.white
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Student">Student</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>
                    Status
                  </label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange} 
                    style={{ 
                      padding: "10px", 
                      borderRadius: "8px", 
                      border: `1px solid #D1D5DB`,
                      width: "100%",
                      boxSizing: "border-box",
                      fontSize: "14px",
                      background: COLORS.white
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>
                  Courses
                </label>
                <CoursesCheckbox
                  courses={courses}
                  selectedCourses={formData.courses}
                  onToggle={handleCheckbox}
                  disabled={formData.role === "Admin"}
                />
                {formData.role === "Admin" && (
                  <p style={{ color: COLORS.warning, fontSize: "12px", marginTop: "4px" }}>
                    Admins cannot be assigned to courses
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button 
                  type="submit" 
                  style={{ 
                    padding: "12px 24px", 
                    borderRadius: "8px", 
                    border: "none", 
                    background: COLORS.deepPurple, 
                    color: COLORS.white,
                    fontWeight: "600",
                    cursor: "pointer",
                    flex: 1,
                    fontSize: "14px"
                  }}
                >
                  {editingUser ? "Update User" : "Add User"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormVisible(false)} 
                  style={{ 
                    padding: "12px 24px", 
                    borderRadius: "8px", 
                    border: "none", 
                    background: COLORS.danger, 
                    color: COLORS.white,
                    fontWeight: "600",
                    cursor: "pointer",
                    flex: 1,
                    fontSize: "14px"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Show Details Modal */}
      {selectedUser && (
        <Modal onClose={handleCloseDetails}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>User Details</h3>
              <button onClick={handleCloseDetails} style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                color: COLORS.deepPurple,
                fontSize: "20px"
              }}>
                <FaTimes />
              </button>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { label: "Full Name", value: selectedUser.fullName },
                { label: "Email", value: selectedUser.email },
                { label: "Phone", value: selectedUser.phone || "-" },
                { label: "Role", value: selectedUser.role },
                { label: "Status", value: selectedUser.status },
                { label: "Address", value: selectedUser.address || "-" },
                { label: "Country", value: selectedUser.country || "-" },
                { label: "Date of Birth", value: selectedUser.dob || "-" },
                { label: "Gender", value: selectedUser.gender || "-" },
                { 
                  label: "Courses", 
                  value: getCourseNames(selectedUser.courses).join(", ") || "None" 
                },
              ].map((item, index) => (
                <div key={index} style={{
                  padding: "12px",
                  background: index % 2 === 0 ? COLORS.lightGray : COLORS.white,
                  borderRadius: "8px",
                  borderLeft: `3px solid ${COLORS.deepPurple}`
                }}>
                  <strong style={{ color: COLORS.textGray, display: "block", marginBottom: "4px", fontSize: "14px" }}>
                    {item.label}
                  </strong>
                  <span style={{ color: COLORS.deepPurple, fontSize: "14px" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Styles matching Dashboard component exactly
const styles = {
  pageContainer: {
    display: "flex",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  mainContent: {
    flex: 1,
    overflowX: "hidden",
  },
  headerSection: {
    marginBottom: "32px",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#3D1A5B",
    margin: 0,
    marginBottom: "8px",
  },
  liveDataBadge: {
    background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
    border: "1px solid rgba(61, 26, 91, 0.2)",
    borderRadius: "8px",
    padding: "12px 16px",
  },
  liveDataText: {
    color: "#3D1A5B",
    fontSize: "14px",
    fontWeight: "600",
    margin: 0,
  },
};

export default UsersPage;