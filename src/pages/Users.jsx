// import React, { useEffect, useState, useMemo } from "react";
// import Sidebar from "../components/Sidebar";
// import { FaEdit, FaTrash, FaKey } from "react-icons/fa";
// import { getAllUsers, deleteUser, updateUser, createUser, getCourses } from "../api/api";
// const BASE_URL = process.env.REACT_APP_API_URL;
// // Reusable Modal Component
// const Modal = ({ children, onClose }) => (
//   <div style={{
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 100,
//   }}>
//     <div style={{
//       background: "#fff",
//       padding: "30px",
//       borderRadius: "12px",
//       width: "500px",
//       maxHeight: "90vh",
//       overflowY: "auto",
//     }}>
//       {children}
//       {onClose && (
//         <button
//           onClick={onClose}
//           style={{
//             marginTop: "12px",
//             padding: "8px 16px",
//             borderRadius: "6px",
//             border: "none",
//             background: "#ef4444",
//             color: "#fff",
//             cursor: "pointer"
//           }}
//         >
//           Close
//         </button>
//       )}
//     </div>
//   </div>
// );

// // Course Checkbox List
// const CoursesCheckbox = ({ courses, selectedCourses, onToggle, disabled }) => (
//   <div style={{
//     display: "flex",
//     flexDirection: "column",
//     border: "1px solid #ccc",
//     padding: "8px",
//     borderRadius: "6px",
//     maxHeight: "150px",
//     overflowY: "auto"
//   }}>
//     {courses.map(course => (
//       <label
//         key={course._id}
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "4px",
//           color: disabled ? "#9ca3af" : "#000"
//         }}
//       >
//         <div>
//           <input
//             type="checkbox"
//             checked={selectedCourses.includes(course._id)}
//             onChange={() => onToggle(course._id)}
//             disabled={disabled}
//           />
//           {course.title}
//         </div>
//         {selectedCourses.includes(course._id) && !disabled && (
//           <button
//             type="button"
//             onClick={() => onToggle(course._id)}
//             style={{
//               background: "#ef4444",
//               color: "#fff",
//               border: "none",
//               borderRadius: "4px",
//               padding: "2px 6px",
//               cursor: "pointer"
//             }}
//           >
//             ❌
//           </button>
//         )}
//       </label>
//     ))}
//   </div>
// );

// const UsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [formVisible, setFormVisible] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     role: "Student",
//     phone: "",
//     address: "",
//     password: "",
//     confirmPassword: "",
//     status: "Active",
//     courses: [],
//     country: "",
//     dob: "",
//     gender: "Male",
//     selectDate: "",
//   });

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const data = await getAllUsers();
//       setUsers(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to fetch users!");
//     }
//   };

//   // Fetch courses
//   const fetchCourses = async () => {
//     try {
//       const data = await getCourses();
//       setCourses(Array.isArray(data) ? data : data.courses || []);
//     } catch (error) {
//       console.error(error);
//       setCourses([]);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchUsers();
//       await fetchCourses();
//     };

//     fetchData(); // initial fetch
//     const interval = setInterval(fetchData, 5000); // fetch every 5 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Add / Edit
//   const handleAdd = () => {
//     setEditingUser(null);
//     setFormData({
//       fullName: "",
//       email: "",
//       role: "Student",
//       phone: "",
//       address: "",
//       password: "",
//       confirmPassword: "",
//       status: "Active",
//       courses: [],
//       country: "",
//       dob: "",
//       gender: "Male",
//       selectDate: "",
//     });
//     setFormVisible(true);
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setFormData({
//       fullName: user.fullName || "",
//       email: user.email || "",
//       role: user.role || "Student",
//       phone: user.phone || "",
//       address: user.address || "",
//       password: "",
//       confirmPassword: "",
//       status: user.status || "Active",
//       courses: user.courses?.map(c => c._id) || [],
//       country: user.country || "",
//       dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
//       gender: user.gender || "Male",
//       selectDate: user.selectDate ? new Date(user.selectDate).toISOString().split("T")[0] : "",
//     });
//     setFormVisible(true);
//   };

//   const handleShowDetails = (user) => setSelectedUser(user);
//   const handleCloseDetails = () => setSelectedUser(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCheckbox = (courseId) => {
//     setFormData(prev => ({
//       ...prev,
//       courses: prev.courses.includes(courseId)
//         ? prev.courses.filter(c => c !== courseId)
//         : [...prev.courses, courseId]
//     }));
//   };

//   // Delete user
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await deleteUser(id);
//       fetchUsers();
//     } catch (error) {
//       console.error(error);
//       alert("Failed to delete user!");
//     }
//   };

//   // Reset password
//   const handleResetPassword = async (userId) => {
//     const newPassword = prompt("Enter new password:");
//     if (!newPassword) return;
//     try {
//       await updateUser(userId, { password: newPassword });
//       alert("Password reset successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to reset password!");
//     }
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Password match check for new user
//     if (!editingUser && formData.password !== formData.confirmPassword) {
//       return alert("Passwords do not match!");
//     }

//     // Phone required check
//     if (!formData.phone) {
//       return alert("Phone number is required!");
//     }

//     try {
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         role: formData.role,
//         phone: formData.phone,
//         address: formData.address,
//         status: formData.status,
//         courses: formData.courses,
//         country: formData.country,
//         dob: formData.dob,
//         gender: formData.gender,
//         selectDate: formData.selectDate,
//       };

//       if (!editingUser) payload.password = formData.password;

//       if (editingUser) {
//         await updateUser(editingUser._id, payload);
//         alert("User updated successfully!");
//       } else {
//         await createUser(payload);
//         alert("User created successfully!");
//       }

//       setFormVisible(false);
//       fetchUsers();
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to save user!");
//     }
//   };

//   const getCourseNames = (userCourses) => {
//     if (!Array.isArray(userCourses)) return [];
//     return userCourses
//       .map(c => (typeof c === "string" ? courses.find(cr => cr._id === c)?.title : c.title))
//       .filter(Boolean);
//   };

//   const filteredUsers = useMemo(() => {
//     return users.filter(user => {
//       const courseTitles = getCourseNames(user.courses).join(" ").toLowerCase();
//       return (
//         user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         courseTitles.includes(searchTerm.toLowerCase())
//       );
//     });
//   }, [users, searchTerm, courses]);

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />
//       <div style={{ marginLeft: "250px", padding: "24px", background: "#f3f4f6", minHeight: "100vh", flex: 1 }}>
//         <h2>User Management</h2>

//         {/* Search & Add */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0" }}>
//           <input
//             type="text"
//             placeholder="Search by Name, Email, or Courses..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", flex: 1, marginRight: "10px" }}
//           />
//           <button
//             onClick={handleAdd}
//             style={{ background: "#f97316", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
//           >
//             + New User
//           </button>
//         </div>

//         {/* Users Table */}
//         <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden" }}>
//           <thead style={{ background: "#fafafa" }}>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th>Phone</th>
//               <th>Courses</th>
//               <th>Show</th>
//               <th>Edit</th>
//               <th>Delete</th>
//               <th>Reset Password</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user, index) => (
//                 <tr key={user._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                   <td>{index + 1}</td>
//                   <td>{user.fullName}</td>
//                   <td>{user.email}</td>
//                   <td>{user.role}</td>
//                   <td style={{ color: user.status === "Active" ? "green" : "red" }}>{user.status}</td>
//                   <td>{user.phone || "-"}</td>
//                   <td>
//                     {getCourseNames(user.courses).map((course, i) => (
//                       <span key={i} style={{
//                         background: "#3b82f6",
//                         color: "#fff",
//                         padding: "2px 6px",
//                         borderRadius: "6px",
//                         marginRight: "4px",
//                         fontSize: "12px"
//                       }}>{course}</span>
//                     ))}
//                   </td>
//                   <td style={{ textAlign: "center" }}>
//                     <button onClick={() => handleShowDetails(user)} style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>Show</button>
//                   </td>
//                   <td style={{ textAlign: "center" }}>
//                     <button onClick={() => handleEdit(user)} style={{ background: "#fde047", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>
//                       <FaEdit />
//                     </button>
//                   </td>
//                   <td style={{ textAlign: "center" }}>
//                     <button onClick={() => handleDelete(user._id)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>
//                       <FaTrash />
//                     </button>
//                   </td>
//                   <td style={{ textAlign: "center" }}>
//                     <button onClick={() => handleResetPassword(user._id)} style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>
//                       <FaKey />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="11" style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>No users found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Add/Edit Form Modal */}
//         {formVisible && (
//           <Modal onClose={() => setFormVisible(false)}>
//             <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
//             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
//               <label>Full Name</label>
//               <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//               <label>Email</label>
//               <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//               {!editingUser && (
//                 <>
//                   <label>Password</label>
//                   <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//                   <label>Confirm Password</label>
//                   <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//                 </>
//               )}
//               <label>Phone No</label>
//               <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />

//               {/* Rest of the fields */}
//               <label>Address</label>
//               <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//               <label>Country</label>
//               <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//               <label>Date of Birth</label>
//               <input name="dob" type="date" value={formData.dob} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//               <label>Gender</label>
//               <select name="gender" value={formData.gender} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//               <label>Selected Date</label>
//               <input name="selectDate" type="date" value={formData.selectDate} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//               <select name="role" value={formData.role} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}>
//                 <option value="Admin">Admin</option>
//                 <option value="Student">Student</option>
//               </select>
//               <label>Status</label>
//               <select name="status" value={formData.status} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>

//               {/* Courses */}
//               <div>
//                 <label><strong>Courses</strong></label>
//                 <CoursesCheckbox
//                   courses={courses}
//                   selectedCourses={formData.courses}
//                   onToggle={handleCheckbox}
//                   disabled={formData.role === "Admin"}
//                 />
//               </div>

//               <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
//                 <button type="submit" style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#3b82f6", color: "#fff" }}>
//                   {editingUser ? "Update User" : "Add User"}
//                 </button>
//                 <button type="button" onClick={() => setFormVisible(false)} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#ef4444", color: "#fff" }}>
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </Modal>
//         )}

//         {/* Show Details Modal */}
//         {selectedUser && (
//           <Modal onClose={handleCloseDetails}>
//             <h3>User Details</h3>
//             <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
//             <p><strong>Email:</strong> {selectedUser.email}</p>
//             <p><strong>Phone:</strong> {selectedUser.phone}</p>
//             <p><strong>Role:</strong> {selectedUser.role}</p>
//             <p><strong>Status:</strong> {selectedUser.status}</p>
//             <p><strong>Address:</strong> {selectedUser.address}</p>
//             <p><strong>Country:</strong> {selectedUser.country}</p>
//             <p><strong>DOB:</strong> {selectedUser.dob}</p>
//             <p><strong>Gender:</strong> {selectedUser.gender}</p>
//             <p><strong>Courses:</strong> {getCourseNames(selectedUser.courses).join(", ")}</p>
//           </Modal>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UsersPage;










// import React, { useEffect, useState, useMemo } from "react";
// import Sidebar from "../components/Sidebar";
// import { FaEdit, FaTrash, FaKey, FaSearch, FaUserPlus, FaEye, FaTimes } from "react-icons/fa";
// import { getAllUsers, deleteUser, updateUser, createUser, getCourses } from "../api/api";

// // Color Theme Constants
// const COLORS = {
//   deepPurple: "#3D1A5B",
//   brightGold: "#F1D572",
//   mutedGold: "#A68A46",
//   textPurple: "#5E427B",
//   lightPurple: "#F5F0FA",
//   white: "#FFFFFF",
//   gray: "#F3F4F6",
//   darkGray: "#6B7280",
//   danger: "#EF4444",
//   success: "#10B981",
//   warning: "#F59E0B",
//   info: "#3B82F6"
// };

// // Reusable Modal Component
// const Modal = ({ children, onClose }) => (
//   <div style={{
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     padding: "16px",
//   }}>
//     <div style={{
//       background: COLORS.white,
//       padding: "24px",
//       borderRadius: "12px",
//       width: "100%",
//       maxWidth: "500px",
//       maxHeight: "90vh",
//       overflowY: "auto",
//       boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//       border: `2px solid ${COLORS.deepPurple}`,
//     }}>
//       <div style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "20px",
//       }}>
//         {children}
//       </div>
//       {onClose && (
//         <div style={{ textAlign: "center", marginTop: "20px" }}>
//           <button
//             onClick={onClose}
//             style={{
//               padding: "10px 24px",
//               borderRadius: "8px",
//               border: "none",
//               background: COLORS.deepPurple,
//               color: COLORS.white,
//               cursor: "pointer",
//               fontWeight: "600",
//               transition: "all 0.3s ease",
//             }}
//             onMouseOver={(e) => e.target.style.background = COLORS.textPurple}
//             onMouseOut={(e) => e.target.style.background = COLORS.deepPurple}
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
// );

// // Course Checkbox List
// const CoursesCheckbox = ({ courses, selectedCourses, onToggle, disabled }) => (
//   <div style={{
//     display: "flex",
//     flexDirection: "column",
//     border: `1px solid ${COLORS.mutedGold}`,
//     padding: "12px",
//     borderRadius: "8px",
//     maxHeight: "150px",
//     overflowY: "auto",
//     background: COLORS.lightPurple,
//   }}>
//     {courses.map(course => (
//       <label
//         key={course._id}
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "8px",
//           padding: "4px",
//           color: disabled ? COLORS.darkGray : COLORS.deepPurple,
//           cursor: disabled ? "not-allowed" : "pointer",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <input
//             type="checkbox"
//             checked={selectedCourses.includes(course._id)}
//             onChange={() => onToggle(course._id)}
//             disabled={disabled}
//             style={{
//               accentColor: COLORS.deepPurple,
//               cursor: disabled ? "not-allowed" : "pointer",
//             }}
//           />
//           <span style={{ 
//             fontWeight: selectedCourses.includes(course._id) ? "600" : "400",
//             color: selectedCourses.includes(course._id) ? COLORS.deepPurple : "inherit"
//           }}>
//             {course.title}
//           </span>
//         </div>
//         {selectedCourses.includes(course._id) && !disabled && (
//           <button
//             type="button"
//             onClick={() => onToggle(course._id)}
//             style={{
//               background: COLORS.danger,
//               color: COLORS.white,
//               border: "none",
//               borderRadius: "4px",
//               padding: "4px 8px",
//               cursor: "pointer",
//               fontSize: "12px",
//             }}
//           >
//             Remove
//           </button>
//         )}
//       </label>
//     ))}
//   </div>
// );

// const UsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [formVisible, setFormVisible] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     role: "Student",
//     phone: "",
//     address: "",
//     password: "",
//     confirmPassword: "",
//     status: "Active",
//     courses: [],
//     country: "",
//     dob: "",
//     gender: "Male",
//     selectDate: "",
//   });

//   // Check screen size
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const data = await getAllUsers();
//       setUsers(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to fetch users!");
//     }
//   };

//   // Fetch courses
//   const fetchCourses = async () => {
//     try {
//       const data = await getCourses();
//       setCourses(Array.isArray(data) ? data : data.courses || []);
//     } catch (error) {
//       console.error(error);
//       setCourses([]);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchUsers();
//       await fetchCourses();
//     };

//     fetchData(); // initial fetch
//     const interval = setInterval(fetchData, 5000); // fetch every 5 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Add / Edit
//   const handleAdd = () => {
//     setEditingUser(null);
//     setFormData({
//       fullName: "",
//       email: "",
//       role: "Student",
//       phone: "",
//       address: "",
//       password: "",
//       confirmPassword: "",
//       status: "Active",
//       courses: [],
//       country: "",
//       dob: "",
//       gender: "Male",
//       selectDate: "",
//     });
//     setFormVisible(true);
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setFormData({
//       fullName: user.fullName || "",
//       email: user.email || "",
//       role: user.role || "Student",
//       phone: user.phone || "",
//       address: user.address || "",
//       password: "",
//       confirmPassword: "",
//       status: user.status || "Active",
//       courses: user.courses?.map(c => c._id) || [],
//       country: user.country || "",
//       dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
//       gender: user.gender || "Male",
//       selectDate: user.selectDate ? new Date(user.selectDate).toISOString().split("T")[0] : "",
//     });
//     setFormVisible(true);
//   };

//   const handleShowDetails = (user) => setSelectedUser(user);
//   const handleCloseDetails = () => setSelectedUser(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCheckbox = (courseId) => {
//     setFormData(prev => ({
//       ...prev,
//       courses: prev.courses.includes(courseId)
//         ? prev.courses.filter(c => c !== courseId)
//         : [...prev.courses, courseId]
//     }));
//   };

//   // Delete user
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await deleteUser(id);
//       fetchUsers();
//     } catch (error) {
//       console.error(error);
//       alert("Failed to delete user!");
//     }
//   };

//   // Reset password
//   const handleResetPassword = async (userId) => {
//     const newPassword = prompt("Enter new password:");
//     if (!newPassword) return;
//     try {
//       await updateUser(userId, { password: newPassword });
//       alert("Password reset successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to reset password!");
//     }
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Password match check for new user
//     if (!editingUser && formData.password !== formData.confirmPassword) {
//       return alert("Passwords do not match!");
//     }

//     // Phone required check
//     if (!formData.phone) {
//       return alert("Phone number is required!");
//     }

//     try {
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         role: formData.role,
//         phone: formData.phone,
//         address: formData.address,
//         status: formData.status,
//         courses: formData.courses,
//         country: formData.country,
//         dob: formData.dob,
//         gender: formData.gender,
//         selectDate: formData.selectDate,
//       };

//       if (!editingUser) payload.password = formData.password;

//       if (editingUser) {
//         await updateUser(editingUser._id, payload);
//         alert("User updated successfully!");
//       } else {
//         await createUser(payload);
//         alert("User created successfully!");
//       }

//       setFormVisible(false);
//       fetchUsers();
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to save user!");
//     }
//   };

//   const getCourseNames = (userCourses) => {
//     if (!Array.isArray(userCourses)) return [];
//     return userCourses
//       .map(c => (typeof c === "string" ? courses.find(cr => cr._id === c)?.title : c.title))
//       .filter(Boolean);
//   };

//   const filteredUsers = useMemo(() => {
//     return users.filter(user => {
//       const courseTitles = getCourseNames(user.courses).join(" ").toLowerCase();
//       return (
//         user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         courseTitles.includes(searchTerm.toLowerCase())
//       );
//     });
//   }, [users, searchTerm, courses]);

//   // Mobile table view
//   const MobileUserCard = ({ user, index }) => (
//     <div style={{
//       background: COLORS.white,
//       borderRadius: "12px",
//       padding: "16px",
//       marginBottom: "12px",
//       borderLeft: `4px solid ${COLORS.deepPurple}`,
//       boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
//         <div>
//           <h4 style={{ 
//             margin: "0 0 8px 0", 
//             color: COLORS.deepPurple,
//             fontSize: "16px"
//           }}>
//             {user.fullName}
//           </h4>
//           <p style={{ 
//             margin: "0 0 4px 0", 
//             fontSize: "14px",
//             color: COLORS.textPurple
//           }}>
//             📧 {user.email}
//           </p>
//           <p style={{ 
//             margin: "0 0 4px 0", 
//             fontSize: "14px",
//             color: COLORS.darkGray
//           }}>
//             👤 {user.role}
//           </p>
//           <p style={{ 
//             margin: "0 0 4px 0", 
//             fontSize: "14px",
//             color: user.status === "Active" ? COLORS.success : COLORS.danger
//           }}>
//             ● {user.status}
//           </p>
//           <p style={{ 
//             margin: "0 0 8px 0", 
//             fontSize: "14px",
//             color: COLORS.darkGray
//           }}>
//             📱 {user.phone || "-"}
//           </p>
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
//           <button onClick={() => handleShowDetails(user)} style={{ 
//             background: COLORS.success, 
//             color: COLORS.white, 
//             border: "none", 
//             padding: "6px 10px", 
//             borderRadius: "6px", 
//             cursor: "pointer",
//             fontSize: "12px"
//           }}>
//             <FaEye />
//           </button>
//           <button onClick={() => handleEdit(user)} style={{ 
//             background: COLORS.warning, 
//             color: COLORS.white, 
//             border: "none", 
//             padding: "6px 10px", 
//             borderRadius: "6px", 
//             cursor: "pointer",
//             fontSize: "12px"
//           }}>
//             <FaEdit />
//           </button>
//           <button onClick={() => handleDelete(user._id)} style={{ 
//             background: COLORS.danger, 
//             color: COLORS.white, 
//             border: "none", 
//             padding: "6px 10px", 
//             borderRadius: "6px", 
//             cursor: "pointer",
//             fontSize: "12px"
//           }}>
//             <FaTrash />
//           </button>
//           <button onClick={() => handleResetPassword(user._id)} style={{ 
//             background: COLORS.info, 
//             color: COLORS.white, 
//             border: "none", 
//             padding: "6px 10px", 
//             borderRadius: "6px", 
//             cursor: "pointer",
//             fontSize: "12px"
//           }}>
//             <FaKey />
//           </button>
//         </div>
//       </div>
      
//       {/* Courses */}
//       <div style={{ marginTop: "12px" }}>
//         <p style={{ 
//           margin: "0 0 6px 0", 
//           fontSize: "12px", 
//           color: COLORS.textPurple,
//           fontWeight: "600"
//         }}>
//           Courses:
//         </p>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
//           {getCourseNames(user.courses).map((course, i) => (
//             <span key={i} style={{
//               background: `linear-gradient(135deg, ${COLORS.deepPurple}, ${COLORS.textPurple})`,
//               color: COLORS.white,
//               padding: "2px 8px",
//               borderRadius: "12px",
//               fontSize: "11px",
//               fontWeight: "500"
//             }}>
//               {course}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
//       {!isMobile && <Sidebar />}
      
//       <div style={{ 
//         marginLeft: isMobile ? "0" : "250px", 
//         padding: isMobile ? "16px" : "24px", 
//         background: COLORS.gray, 
//         minHeight: "100vh", 
//         flex: 1,
//         width: isMobile ? "100%" : "auto"
//       }}>
//         <h2 style={{ 
//           color: COLORS.deepPurple, 
//           marginBottom: "20px",
//           fontSize: isMobile ? "20px" : "24px"
//         }}>
//           User Management
//         </h2>

//         {/* Search & Add */}
//         <div style={{ 
//           display: "flex", 
//           flexDirection: isMobile ? "column" : "row",
//           gap: isMobile ? "12px" : "0",
//           justifyContent: "space-between", 
//           alignItems: isMobile ? "stretch" : "center", 
//           margin: "20px 0" 
//         }}>
//           <div style={{
//             position: "relative",
//             flex: isMobile ? "none" : 1,
//             marginRight: isMobile ? "0" : "10px"
//           }}>
//             <FaSearch style={{
//               position: "absolute",
//               left: "12px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: COLORS.textPurple
//             }} />
//             <input
//               type="text"
//               placeholder="Search by Name, Email, or Courses..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{ 
//                 padding: "12px 12px 12px 40px", 
//                 borderRadius: "8px", 
//                 border: `1px solid ${COLORS.mutedGold}`,
//                 width: "100%",
//                 fontSize: "14px",
//                 background: COLORS.white,
//                 boxSizing: "border-box"
//               }}
//             />
//           </div>
//           <button
//             onClick={handleAdd}
//             style={{ 
//               background: `linear-gradient(135deg, ${COLORS.deepPurple}, ${COLORS.textPurple})`, 
//               color: COLORS.white, 
//               border: "none", 
//               padding: "12px 20px", 
//               borderRadius: "8px", 
//               cursor: "pointer",
//               fontWeight: "600",
//               fontSize: isMobile ? "14px" : "16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//               transition: "all 0.3s ease",
//             }}
//             onMouseOver={(e) => e.target.style.background = `linear-gradient(135deg, ${COLORS.textPurple}, ${COLORS.deepPurple})`}
//             onMouseOut={(e) => e.target.style.background = `linear-gradient(135deg, ${COLORS.deepPurple}, ${COLORS.textPurple})`}
//           >
//             <FaUserPlus /> {isMobile ? "New User" : "+ New User"}
//           </button>
//         </div>

//         {/* Users Table/Cards */}
//         {!isMobile ? (
//           <div style={{
//             overflowX: "auto",
//             background: COLORS.white,
//             borderRadius: "12px",
//             padding: "16px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           }}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ 
//                   background: `linear-gradient(90deg, ${COLORS.deepPurple}, ${COLORS.textPurple})`,
//                   color: COLORS.white
//                 }}>
//                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>#</th>
//                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>Name</th>
//                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>Email</th>
//                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>Role</th>
//                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>Status</th>
//                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>Phone</th>
//                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600" }}>Courses</th>
//                   <th style={{ padding: "12px", textAlign: "center", fontSize: "14px", fontWeight: "600" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user, index) => (
//                     <tr key={user._id} style={{ 
//                       borderBottom: `1px solid ${COLORS.lightPurple}`,
//                       background: index % 2 === 0 ? COLORS.white : COLORS.gray,
//                       transition: "background 0.3s ease"
//                     }}>
//                       <td style={{ padding: "12px", color: COLORS.deepPurple, fontWeight: "600" }}>{index + 1}</td>
//                       <td style={{ padding: "12px", color: COLORS.textPurple }}>{user.fullName}</td>
//                       <td style={{ padding: "12px", color: COLORS.darkGray }}>{user.email}</td>
//                       <td style={{ padding: "12px" }}>
//                         <span style={{
//                           background: COLORS.lightPurple,
//                           color: COLORS.deepPurple,
//                           padding: "4px 12px",
//                           borderRadius: "20px",
//                           fontSize: "12px",
//                           fontWeight: "500"
//                         }}>
//                           {user.role}
//                         </span>
//                       </td>
//                       <td style={{ padding: "12px" }}>
//                         <span style={{
//                           color: user.status === "Active" ? COLORS.success : COLORS.danger,
//                           fontWeight: "600",
//                           padding: "4px 12px",
//                           borderRadius: "20px",
//                           background: user.status === "Active" ? "#D1FAE5" : "#FEE2E2",
//                           fontSize: "12px"
//                         }}>
//                           {user.status}
//                         </span>
//                       </td>
//                       <td style={{ padding: "12px", color: COLORS.darkGray }}>{user.phone || "-"}</td>
//                       <td style={{ padding: "12px" }}>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "200px" }}>
//                           {getCourseNames(user.courses).slice(0, 2).map((course, i) => (
//                             <span key={i} style={{
//                               background: `linear-gradient(135deg, ${COLORS.mutedGold}, ${COLORS.brightGold})`,
//                               color: COLORS.deepPurple,
//                               padding: "2px 8px",
//                               borderRadius: "12px",
//                               fontSize: "11px",
//                               fontWeight: "500"
//                             }}>
//                               {course}
//                             </span>
//                           ))}
//                           {getCourseNames(user.courses).length > 2 && (
//                             <span style={{
//                               background: COLORS.lightPurple,
//                               color: COLORS.textPurple,
//                               padding: "2px 8px",
//                               borderRadius: "12px",
//                               fontSize: "11px",
//                               fontWeight: "500"
//                             }}>
//                               +{getCourseNames(user.courses).length - 2}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td style={{ padding: "12px", textAlign: "center" }}>
//                         <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
//                           <button onClick={() => handleShowDetails(user)} style={{ 
//                             background: COLORS.success, 
//                             color: COLORS.white, 
//                             border: "none", 
//                             padding: "6px 10px", 
//                             borderRadius: "6px", 
//                             cursor: "pointer",
//                             transition: "transform 0.2s ease"
//                           }} onMouseOver={(e) => e.target.style.transform = "scale(1.1)"} onMouseOut={(e) => e.target.style.transform = "scale(1)"}>
//                             <FaEye />
//                           </button>
//                           <button onClick={() => handleEdit(user)} style={{ 
//                             background: COLORS.warning, 
//                             color: COLORS.white, 
//                             border: "none", 
//                             padding: "6px 10px", 
//                             borderRadius: "6px", 
//                             cursor: "pointer",
//                             transition: "transform 0.2s ease"
//                           }} onMouseOver={(e) => e.target.style.transform = "scale(1.1)"} onMouseOut={(e) => e.target.style.transform = "scale(1)"}>
//                             <FaEdit />
//                           </button>
//                           <button onClick={() => handleDelete(user._id)} style={{ 
//                             background: COLORS.danger, 
//                             color: COLORS.white, 
//                             border: "none", 
//                             padding: "6px 10px", 
//                             borderRadius: "6px", 
//                             cursor: "pointer",
//                             transition: "transform 0.2s ease"
//                           }} onMouseOver={(e) => e.target.style.transform = "scale(1.1)"} onMouseOut={(e) => e.target.style.transform = "scale(1)"}>
//                             <FaTrash />
//                           </button>
//                           <button onClick={() => handleResetPassword(user._id)} style={{ 
//                             background: COLORS.info, 
//                             color: COLORS.white, 
//                             border: "none", 
//                             padding: "6px 10px", 
//                             borderRadius: "6px", 
//                             cursor: "pointer",
//                             transition: "transform 0.2s ease"
//                           }} onMouseOver={(e) => e.target.style.transform = "scale(1.1)"} onMouseOut={(e) => e.target.style.transform = "scale(1)"}>
//                             <FaKey />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: COLORS.darkGray }}>
//                       No users found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           // Mobile Cards View
//           <div>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user, index) => (
//                 <MobileUserCard key={user._id} user={user} index={index} />
//               ))
//             ) : (
//               <div style={{
//                 padding: "40px",
//                 textAlign: "center",
//                 color: COLORS.darkGray,
//                 background: COLORS.white,
//                 borderRadius: "12px",
//                 marginTop: "20px"
//               }}>
//                 No users found
//               </div>
//             )}
//           </div>
//         )}

//         {/* Add/Edit Form Modal */}
//         {formVisible && (
//           <Modal onClose={() => setFormVisible(false)}>
//             <div style={{ width: "100%" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//                 <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>
//                   {editingUser ? "Edit User" : "Add New User"}
//                 </h3>
//                 <button onClick={() => setFormVisible(false)} style={{ 
//                   background: "none", 
//                   border: "none", 
//                   cursor: "pointer", 
//                   color: COLORS.deepPurple,
//                   fontSize: "20px"
//                 }}>
//                   <FaTimes />
//                 </button>
//               </div>
//               <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//                 <div>
//                   <label style={{ 
//                     display: "block", 
//                     marginBottom: "6px", 
//                     color: COLORS.textPurple,
//                     fontWeight: "600",
//                     fontSize: "14px"
//                   }}>Full Name</label>
//                   <input 
//                     name="fullName" 
//                     placeholder="Full Name" 
//                     value={formData.fullName} 
//                     onChange={handleChange} 
//                     required 
//                     style={{ 
//                       padding: "10px", 
//                       borderRadius: "8px", 
//                       border: `1px solid ${COLORS.mutedGold}`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       fontSize: "14px"
//                     }} 
//                   />
//                 </div>

//                 <div>
//                   <label style={{ 
//                     display: "block", 
//                     marginBottom: "6px", 
//                     color: COLORS.textPurple,
//                     fontWeight: "600",
//                     fontSize: "14px"
//                   }}>Email</label>
//                   <input 
//                     name="email" 
//                     type="email" 
//                     placeholder="Email" 
//                     value={formData.email} 
//                     onChange={handleChange} 
//                     required 
//                     style={{ 
//                       padding: "10px", 
//                       borderRadius: "8px", 
//                       border: `1px solid ${COLORS.mutedGold}`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       fontSize: "14px"
//                     }} 
//                   />
//                 </div>

//                 {!editingUser && (
//                   <>
//                     <div>
//                       <label style={{ 
//                         display: "block", 
//                         marginBottom: "6px", 
//                         color: COLORS.textPurple,
//                         fontWeight: "600",
//                         fontSize: "14px"
//                       }}>Password</label>
//                       <input 
//                         name="password" 
//                         type="password" 
//                         placeholder="Password" 
//                         value={formData.password} 
//                         onChange={handleChange} 
//                         required 
//                         style={{ 
//                           padding: "10px", 
//                           borderRadius: "8px", 
//                           border: `1px solid ${COLORS.mutedGold}`,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           fontSize: "14px"
//                         }} 
//                       />
//                     </div>

//                     <div>
//                       <label style={{ 
//                         display: "block", 
//                         marginBottom: "6px", 
//                         color: COLORS.textPurple,
//                         fontWeight: "600",
//                         fontSize: "14px"
//                       }}>Confirm Password</label>
//                       <input 
//                         name="confirmPassword" 
//                         type="password" 
//                         placeholder="Confirm Password" 
//                         value={formData.confirmPassword} 
//                         onChange={handleChange} 
//                         required 
//                         style={{ 
//                           padding: "10px", 
//                           borderRadius: "8px", 
//                           border: `1px solid ${COLORS.mutedGold}`,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           fontSize: "14px"
//                         }} 
//                       />
//                     </div>
//                   </>
//                 )}

//                 <div>
//                   <label style={{ 
//                     display: "block", 
//                     marginBottom: "6px", 
//                     color: COLORS.textPurple,
//                     fontWeight: "600",
//                     fontSize: "14px"
//                   }}>Phone No</label>
//                   <input 
//                     name="phone" 
//                     placeholder="Phone" 
//                     value={formData.phone} 
//                     onChange={handleChange} 
//                     required 
//                     style={{ 
//                       padding: "10px", 
//                       borderRadius: "8px", 
//                       border: `1px solid ${COLORS.mutedGold}`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       fontSize: "14px"
//                     }} 
//                   />
//                 </div>

//                 {/* Rest of fields */}
//                 <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
//                   <div>
//                     <label style={{ 
//                       display: "block", 
//                       marginBottom: "6px", 
//                       color: COLORS.textPurple,
//                       fontWeight: "600",
//                       fontSize: "14px"
//                     }}>Role</label>
//                     <select 
//                       name="role" 
//                       value={formData.role} 
//                       onChange={handleChange} 
//                       style={{ 
//                         padding: "10px", 
//                         borderRadius: "8px", 
//                         border: `1px solid ${COLORS.mutedGold}`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         fontSize: "14px",
//                         background: COLORS.white
//                       }}
//                     >
//                       <option value="Admin">Admin</option>
//                       <option value="Student">Student</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label style={{ 
//                       display: "block", 
//                       marginBottom: "6px", 
//                       color: COLORS.textPurple,
//                       fontWeight: "600",
//                       fontSize: "14px"
//                     }}>Status</label>
//                     <select 
//                       name="status" 
//                       value={formData.status} 
//                       onChange={handleChange} 
//                       style={{ 
//                         padding: "10px", 
//                         borderRadius: "8px", 
//                         border: `1px solid ${COLORS.mutedGold}`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         fontSize: "14px",
//                         background: COLORS.white
//                       }}
//                     >
//                       <option value="Active">Active</option>
//                       <option value="Inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Courses */}
//                 <div>
//                   <label style={{ 
//                     display: "block", 
//                     marginBottom: "6px", 
//                     color: COLORS.textPurple,
//                     fontWeight: "600",
//                     fontSize: "14px"
//                   }}>Courses</label>
//                   <CoursesCheckbox
//                     courses={courses}
//                     selectedCourses={formData.courses}
//                     onToggle={handleCheckbox}
//                     disabled={formData.role === "Admin"}
//                   />
//                   {formData.role === "Admin" && (
//                     <p style={{ color: COLORS.mutedGold, fontSize: "12px", marginTop: "4px" }}>
//                       Admins cannot be assigned to courses
//                     </p>
//                   )}
//                 </div>

//                 <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
//                   <button 
//                     type="submit" 
//                     style={{ 
//                       padding: "12px 24px", 
//                       borderRadius: "8px", 
//                       border: "none", 
//                       background: `linear-gradient(135deg, ${COLORS.deepPurple}, ${COLORS.textPurple})`, 
//                       color: COLORS.white,
//                       fontWeight: "600",
//                       cursor: "pointer",
//                       flex: 1,
//                       fontSize: "14px"
//                     }}
//                   >
//                     {editingUser ? "Update User" : "Add User"}
//                   </button>
//                   <button 
//                     type="button" 
//                     onClick={() => setFormVisible(false)} 
//                     style={{ 
//                       padding: "12px 24px", 
//                       borderRadius: "8px", 
//                       border: "none", 
//                       background: COLORS.danger, 
//                       color: COLORS.white,
//                       fontWeight: "600",
//                       cursor: "pointer",
//                       flex: 1,
//                       fontSize: "14px"
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </Modal>
//         )}

//         {/* Show Details Modal */}
//         {selectedUser && (
//           <Modal onClose={handleCloseDetails}>
//             <div style={{ width: "100%" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//                 <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>User Details</h3>
//                 <button onClick={handleCloseDetails} style={{ 
//                   background: "none", 
//                   border: "none", 
//                   cursor: "pointer", 
//                   color: COLORS.deepPurple,
//                   fontSize: "20px"
//                 }}>
//                   <FaTimes />
//                 </button>
//               </div>
//               <div style={{ display: "grid", gap: "12px" }}>
//                 {[
//                   { label: "Full Name", value: selectedUser.fullName },
//                   { label: "Email", value: selectedUser.email },
//                   { label: "Phone", value: selectedUser.phone || "-" },
//                   { label: "Role", value: selectedUser.role },
//                   { label: "Status", value: selectedUser.status },
//                   { label: "Address", value: selectedUser.address || "-" },
//                   { label: "Country", value: selectedUser.country || "-" },
//                   { label: "Date of Birth", value: selectedUser.dob || "-" },
//                   { label: "Gender", value: selectedUser.gender || "-" },
//                   { 
//                     label: "Courses", 
//                     value: getCourseNames(selectedUser.courses).join(", ") || "None" 
//                   },
//                 ].map((item, index) => (
//                   <div key={index} style={{
//                     padding: "12px",
//                     background: index % 2 === 0 ? COLORS.lightPurple : COLORS.white,
//                     borderRadius: "8px",
//                     borderLeft: `3px solid ${COLORS.deepPurple}`
//                   }}>
//                     <strong style={{ color: COLORS.textPurple, display: "block", marginBottom: "4px" }}>
//                       {item.label}
//                     </strong>
//                     <span style={{ color: COLORS.deepPurple }}>{item.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </Modal>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UsersPage;






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