// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import { FaEdit, FaTrash, FaVideo, FaPlus, FaTimes } from "react-icons/fa";
// import { getCourses, deleteCourse, updateCourse, createCourse } from "../api/api";

// // Predefined categories and subcategories
// const CATEGORIES = [
//   { 
//     name: "Programming", 
//     subcategories: ["Python", "JavaScript", "Java", "C++", "PHP", "Ruby", "Go", "Swift"]
//   },
//   { 
//     name: "Web Development", 
//     subcategories: ["Frontend", "Backend", "Full Stack", "React", "Angular", "Vue.js", "Node.js"]
//   },
//   { 
//     name: "Data Science", 
//     subcategories: ["Machine Learning", "AI", "Data Analysis", "Big Data", "Statistics", "Deep Learning"]
//   },
//   { 
//     name: "Mobile Development", 
//     subcategories: ["iOS", "Android", "React Native", "Flutter", "Kotlin", "Swift"]
//   },
//   { 
//     name: "Design", 
//     subcategories: ["UI/UX", "Graphic Design", "Web Design", "Adobe Photoshop", "Figma", "Adobe XD"]
//   },
//   { 
//     name: "Business", 
//     subcategories: ["Marketing", "Finance", "Management", "Entrepreneurship", "Sales", "Leadership"]
//   },
//   { 
//     name: "Cloud Computing", 
//     subcategories: ["AWS", "Azure", "Google Cloud", "DevOps", "Docker", "Kubernetes"]
//   },
//   { 
//     name: "Database", 
//     subcategories: ["MySQL", "MongoDB", "PostgreSQL", "Redis", "Firebase", "Oracle"]
//   },
// ];

// // Modal Component
// const Modal = ({ children, onClose }) => (
//   <div style={{
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//   }}>
//     <div style={{
//       background: "#fff",
//       padding: "30px",
//       borderRadius: "12px",
//       width: "600px",
//       maxHeight: "90vh",
//       overflowY: "auto",
//     }}>
//       {children}
//     </div>
//   </div>
// );

// // Category Checkbox Component
// const CategoryCheckbox = ({ categories, selectedCategory, onSelect }) => (
//   <div style={{
//     display: "grid",
//     gridTemplateColumns: "repeat(2, 1fr)",
//     gap: "8px",
//     border: "1px solid #ccc",
//     padding: "12px",
//     borderRadius: "6px",
//     maxHeight: "200px",
//     overflowY: "auto"
//   }}>
//     {categories.map(cat => (
//       <label
//         key={cat.name}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "6px",
//           cursor: "pointer",
//           backgroundColor: selectedCategory === cat.name ? "#e0f2fe" : "transparent",
//           borderRadius: "4px",
//           transition: "background-color 0.2s"
//         }}
//       >
//         <input
//           type="radio"
//           checked={selectedCategory === cat.name}
//           onChange={() => onSelect(cat.name)}
//           style={{ marginRight: "8px" }}
//         />
//         <span style={{ fontWeight: selectedCategory === cat.name ? "600" : "400" }}>
//           {cat.name}
//         </span>
//       </label>
//     ))}
//   </div>
// );

// // Subcategory Checkbox Component
// const SubcategoryCheckbox = ({ subcategories, selectedSubcategories, onToggle }) => (
//   <div style={{
//     display: "grid",
//     gridTemplateColumns: "repeat(2, 1fr)",
//     gap: "8px",
//     border: "1px solid #ccc",
//     padding: "12px",
//     borderRadius: "6px",
//     maxHeight: "200px",
//     overflowY: "auto",
//     backgroundColor: subcategories.length === 0 ? "#f9fafb" : "transparent"
//   }}>
//     {subcategories.length === 0 ? (
//       <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280", margin: 0 }}>
//         Please select a category first
//       </p>
//     ) : (
//       subcategories.map(sub => (
//         <label
//           key={sub}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "6px",
//             cursor: "pointer",
//             backgroundColor: selectedSubcategories.includes(sub) ? "#dbeafe" : "transparent",
//             borderRadius: "4px",
//             transition: "background-color 0.2s"
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <input
//               type="checkbox"
//               checked={selectedSubcategories.includes(sub)}
//               onChange={() => onToggle(sub)}
//               style={{ marginRight: "8px" }}
//             />
//             <span>{sub}</span>
//           </div>
//           {selectedSubcategories.includes(sub) && (
//             <FaTimes
//               onClick={(e) => {
//                 e.preventDefault();
//                 onToggle(sub);
//               }}
//               style={{
//                 color: "#ef4444",
//                 cursor: "pointer",
//                 fontSize: "12px"
//               }}
//             />
//           )}
//         </label>
//       ))
//     )}
//   </div>
// );

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   // Form data state
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     subCategories: [],
//     duration: 0,
//     level: "Beginner",
//     price: 0,
//     status: "Active",
//   });

//   // Custom category/subcategory input
//   const [customCategory, setCustomCategory] = useState("");
//   const [customSubcategory, setCustomSubcategory] = useState("");

//   // Fetch courses
//   const fetchCourses = async () => {
//     try {
//       const data = await getCourses();
//       if (Array.isArray(data)) {
//         setCourses(data);
//       } else if (Array.isArray(data.courses)) {
//         setCourses(data.courses);
//       } else {
//         setCourses([]);
//       }
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       alert("Failed to fetch courses");
//       setCourses([]);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Open add form
//   const openAddForm = () => {
//     setEditingId(null);
//     setFormData({
//       title: "",
//       description: "",
//       category: "",
//       subCategories: [],
//       duration: 0,
//       level: "Beginner",
//       price: 0,
//       status: "Active",
//     });
//     setCustomCategory("");
//     setCustomSubcategory("");
//     setShowForm(true);
//   };

//   // Open edit form
//   const openEditForm = (course) => {
//     setEditingId(course._id);
//     setFormData({
//       title: course.title || "",
//       description: course.description || "",
//       category: course.category || "",
//       subCategories: course.subCategories || [],
//       duration: course.duration || 0,
//       level: course.level || "Beginner",
//       price: course.price || 0,
//       status: course.status || "Active",
//     });
//     setCustomCategory("");
//     setCustomSubcategory("");
//     setShowForm(true);
//   };

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle category selection
//   const handleCategorySelect = (categoryName) => {
//     setFormData({ ...formData, category: categoryName, subCategories: [] });
//   };

//   // Handle subcategory toggle
//   const handleSubcategoryToggle = (subcategory) => {
//     setFormData(prev => ({
//       ...prev,
//       subCategories: prev.subCategories.includes(subcategory)
//         ? prev.subCategories.filter(s => s !== subcategory)
//         : [...prev.subCategories, subcategory]
//     }));
//   };

//   // Add custom category
//   const handleAddCustomCategory = () => {
//     if (customCategory.trim() && !CATEGORIES.find(c => c.name === customCategory.trim())) {
//       setFormData({ ...formData, category: customCategory.trim(), subCategories: [] });
//       setCustomCategory("");
//     }
//   };

//   // Add custom subcategory
//   const handleAddCustomSubcategory = () => {
//     if (customSubcategory.trim() && !formData.subCategories.includes(customSubcategory.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         subCategories: [...prev.subCategories, customSubcategory.trim()]
//       }));
//       setCustomSubcategory("");
//     }
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = { ...formData };

//       // Convert subCategories to JSON string if backend expects string
//       if (Array.isArray(payload.subCategories)) {
//         payload.subCategories = JSON.stringify(payload.subCategories);
//       }

//       if (editingId) {
//         await updateCourse(editingId, payload);
//         alert("Course updated successfully");
//       } else {
//         await createCourse(payload);
//         alert("Course added successfully");
//       }

//       setShowForm(false);
//       fetchCourses();
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       alert(error.response?.data?.message || "Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete course
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this course?")) return;

//     try {
//       await deleteCourse(id);
//       fetchCourses();
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       alert("Delete failed");
//     }
//   };

//   // Get available subcategories for selected category
//   const getAvailableSubcategories = () => {
//     const selectedCat = CATEGORIES.find(c => c.name === formData.category);
//     return selectedCat ? selectedCat.subcategories : [];
//   };

//   // Filter courses
//   const filteredCourses = Array.isArray(courses)
//     ? courses.filter(
//         (course) =>
//           course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           course.subCategories?.some((sub) =>
//             sub.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//       )
//     : [];

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />

//       <div style={{
//         marginLeft: "250px",
//         backgroundColor: "#f3f4f6",
//         minHeight: "100vh",
//         padding: "24px",
//         flex: 1,
//       }}>
//         <h1 style={{ marginBottom: "20px" }}>📚 Courses Management</h1>

//         {/* Table Section */}
//         <div style={{ background: "#fff", padding: "20px", borderRadius: "12px" }}>
//           <div style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: "15px",
//             alignItems: "center",
//           }}>
//             <h3>All Courses</h3>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <input
//                 type="text"
//                 placeholder="Search Courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{
//                   padding: "8px 12px",
//                   borderRadius: "8px",
//                   border: "1px solid #d1d5db",
//                 }}
//               />
//               <button
//                 onClick={openAddForm}
//                 style={{
//                   background: "#f97316",
//                   color: "#fff",
//                   border: "none",
//                   padding: "8px 16px",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                 }}
//               >
//                 + New Course
//               </button>
//             </div>
//           </div>

//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead style={{ background: "#fafafa" }}>
//               <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
//                 <th style={{ padding: "12px", textAlign: "left" }}>#</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Title</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Subcategories</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Duration</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Level</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Price</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
//                 <th style={{ padding: "12px", textAlign: "center" }}>Edit</th>
//                 <th style={{ padding: "12px", textAlign: "center" }}>Delete</th>
//                 <th style={{ padding: "12px", textAlign: "center" }}>Lectures</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCourses.length === 0 ? (
//                 <tr>
//                   <td colSpan="11" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
//                     No courses found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCourses.map((course, index) => (
//                   <tr key={course._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                     <td style={{ padding: "12px" }}>{index + 1}</td>
//                     <td style={{ padding: "12px" }}>{course.title}</td>
//                     <td style={{ padding: "12px" }}>
//                       <span style={{
//                         background: "#e0e7ff",
//                         color: "#4338ca",
//                         padding: "4px 8px",
//                         borderRadius: "6px",
//                         fontSize: "12px",
//                         fontWeight: "500"
//                       }}>
//                         {course.category}
//                       </span>
//                     </td>
//                     <td style={{ padding: "12px" }}>
//                       {course.subCategories?.map((sub, i) => (
//                         <span key={i} style={{
//                           background: "#dbeafe",
//                           color: "#1e40af",
//                           padding: "2px 6px",
//                           borderRadius: "4px",
//                           marginRight: "4px",
//                           fontSize: "11px",
//                           display: "inline-block",
//                           marginBottom: "2px"
//                         }}>
//                           {sub}
//                         </span>
//                       )) || "-"}
//                     </td>
//                     <td style={{ padding: "12px" }}>{course.duration}h</td>
//                     <td style={{ padding: "12px" }}>{course.level}</td>
//                     <td style={{ padding: "12px" }}>${course.price}</td>
//                     <td style={{ padding: "12px" }}>
//                       <span style={{
//                         color: course.status === "Active" ? "#16a34a" : "#dc2626",
//                         fontWeight: "500"
//                       }}>
//                         {course.status}
//                       </span>
//                     </td>
//                     <td style={{ padding: "12px", textAlign: "center" }}>
//                       <button
//                         onClick={() => openEditForm(course)}
//                         style={{
//                           background: "#fde047",
//                           border: "none",
//                           padding: "6px 10px",
//                           borderRadius: "6px",
//                           cursor: "pointer",
//                         }}
//                       >
//                         <FaEdit />
//                       </button>
//                     </td>
//                     <td style={{ padding: "12px", textAlign: "center" }}>
//                       <button
//                         onClick={() => handleDelete(course._id)}
//                         style={{
//                           background: "#ef4444",
//                           color: "#fff",
//                           border: "none",
//                           padding: "6px 10px",
//                           borderRadius: "6px",
//                           cursor: "pointer",
//                         }}
//                       >
//                         <FaTrash />
//                       </button>
//                     </td>
//                     <td style={{ padding: "12px", textAlign: "center" }}>
//                       <button
//                         onClick={() => navigate(`/lectures/${course._id}`)}
//                         style={{
//                           background: "#3b82f6",
//                           color: "#fff",
//                           border: "none",
//                           padding: "6px 10px",
//                           borderRadius: "6px",
//                           cursor: "pointer",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: "4px"
//                         }}
//                       >
//                         <FaVideo /> View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Add/Edit Form Modal */}
//         {showForm && (
//           <Modal onClose={() => setShowForm(false)}>
//             <h3 style={{ marginBottom: "20px" }}>
//               {editingId ? "Edit Course" : "Add New Course"}
//             </h3>
//             <form
//               onSubmit={handleSubmit}
//               style={{ display: "flex", flexDirection: "column", gap: "14px" }}
//             >
//               <div>
//                 <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                   Course Title
//                 </label>
//                 <input
//                   name="title"
//                   placeholder="Enter course title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     width: "100%",
//                     padding: "8px",
//                     borderRadius: "6px",
//                     border: "1px solid #ccc"
//                   }}
//                 />
//               </div>

//               <div>
//                 <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   placeholder="Enter course description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   required
//                   rows={4}
//                   style={{
//                     width: "100%",
//                     padding: "8px",
//                     borderRadius: "6px",
//                     border: "1px solid #ccc",
//                     resize: "vertical"
//                   }}
//                 />
//               </div>

//               <div>
//                 <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                   Category
//                 </label>
//                 <CategoryCheckbox
//                   categories={CATEGORIES}
//                   selectedCategory={formData.category}
//                   onSelect={handleCategorySelect}
//                 />
//                 <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
//                   <input
//                     type="text"
//                     placeholder="Or add custom category"
//                     value={customCategory}
//                     onChange={(e) => setCustomCategory(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomCategory())}
//                     style={{
//                       flex: 1,
//                       padding: "6px 8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc",
//                       fontSize: "13px"
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddCustomCategory}
//                     style={{
//                       background: "#10b981",
//                       color: "#fff",
//                       border: "none",
//                       padding: "6px 12px",
//                       borderRadius: "6px",
//                       cursor: "pointer",
//                       fontSize: "13px"
//                     }}
//                   >
//                     <FaPlus />
//                   </button>
//                 </div>
//                 {formData.category && (
//                   <div style={{ marginTop: "8px", fontSize: "13px", color: "#059669" }}>
//                     Selected: <strong>{formData.category}</strong>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                   Subcategories
//                 </label>
//                 <SubcategoryCheckbox
//                   subcategories={getAvailableSubcategories()}
//                   selectedSubcategories={formData.subCategories}
//                   onToggle={handleSubcategoryToggle}
//                 />
//                 <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
//                   <input
//                     type="text"
//                     placeholder="Or add custom subcategory"
//                     value={customSubcategory}
//                     onChange={(e) => setCustomSubcategory(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomSubcategory())}
//                     disabled={!formData.category}
//                     style={{
//                       flex: 1,
//                       padding: "6px 8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc",
//                       fontSize: "13px"
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddCustomSubcategory}
//                     disabled={!formData.category}
//                     style={{
//                       background: formData.category ? "#10b981" : "#9ca3af",
//                       color: "#fff",
//                       border: "none",
//                       padding: "6px 12px",
//                       borderRadius: "6px",
//                       cursor: formData.category ? "pointer" : "not-allowed",
//                       fontSize: "13px"
//                     }}
//                   >
//                     <FaPlus />
//                   </button>
//                 </div>
//                 {formData.subCategories.length > 0 && (
//                   <div style={{ marginTop: "8px", fontSize: "13px" }}>
//                     <strong>Selected:</strong>{" "}
//                     {formData.subCategories.map((sub, i) => (
//                       <span key={i} style={{
//                         background: "#dbeafe",
//                         padding: "2px 6px",
//                         borderRadius: "4px",
//                         marginRight: "4px",
//                         display: "inline-block",
//                         marginBottom: "4px"
//                       }}>
//                         {sub}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                     Duration (hours)
//                   </label>
//                   <input
//                     name="duration"
//                     type="number"
//                     placeholder="Duration"
//                     value={formData.duration}
//                     onChange={handleChange}
//                     min="0"
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc"
//                     }}
//                   />
//                 </div>

//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                     Price ($)
//                   </label>
//                   <input
//                     name="price"
//                     type="number"
//                     placeholder="Price"
//                     value={formData.price}
//                     onChange={handleChange}
//                     min="0"
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc"
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                     Level
//                   </label>
//                   <select
//                     name="level"
//                     value={formData.level}
//                     onChange={handleChange}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc"
//                     }}
//                   >
//                     <option value="Beginner">Beginner</option>
//                     <option value="Intermediate">Intermediate</option>
//                     <option value="Advanced">Advanced</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc"
//                     }}
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   style={{
//                     background: "#3b82f6",
//                     color: "#fff",
//                     border: "none",
//                     padding: "10px",
//                     borderRadius: "6px",
//                     flex: 1,
//                     cursor: loading ? "not-allowed" : "pointer",
//                     opacity: loading ? 0.7 : 1
//                   }}
//                 >
//                   {loading ? "Saving..." : editingId ? "Update Course" : "Add Course"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   style={{
//                     background: "#ef4444",
//                     color: "#fff",
//                     border: "none",
//                     padding: "10px",
//                     borderRadius: "6px",
//                     flex: 1,
//                     cursor: "pointer"
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </Modal>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Courses;













// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import { FaEdit, FaTrash, FaVideo, FaPlus, FaTimes, FaDollarSign, FaLock, FaUnlock } from "react-icons/fa";
// import { getCourses, deleteCourse, updateCourse, createCourse } from "../api/api";

// // Predefined categories and subcategories
// const CATEGORIES = [
//   { 
//     name: "Programming", 
//     subcategories: ["Python", "JavaScript", "Java", "C++", "PHP", "Ruby", "Go", "Swift"]
//   },
//   { 
//     name: "Web Development", 
//     subcategories: ["Frontend", "Backend", "Full Stack", "React", "Angular", "Vue.js", "Node.js"]
//   },
//   { 
//     name: "Data Science", 
//     subcategories: ["Machine Learning", "AI", "Data Analysis", "Big Data", "Statistics", "Deep Learning"]
//   },
//   { 
//     name: "Mobile Development", 
//     subcategories: ["iOS", "Android", "React Native", "Flutter", "Kotlin", "Swift"]
//   },
//   { 
//     name: "Design", 
//     subcategories: ["UI/UX", "Graphic Design", "Web Design", "Adobe Photoshop", "Figma", "Adobe XD"]
//   },
//   { 
//     name: "Business", 
//     subcategories: ["Marketing", "Finance", "Management", "Entrepreneurship", "Sales", "Leadership"]
//   },
//   { 
//     name: "Cloud Computing", 
//     subcategories: ["AWS", "Azure", "Google Cloud", "DevOps", "Docker", "Kubernetes"]
//   },
//   { 
//     name: "Database", 
//     subcategories: ["MySQL", "MongoDB", "PostgreSQL", "Redis", "Firebase", "Oracle"]
//   },
// ];

// // Modal Component
// const Modal = ({ children, onClose }) => (
//   <div style={{
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//   }}>
//     <div style={{
//       background: "#fff",
//       padding: "30px",
//       borderRadius: "12px",
//       width: "600px",
//       maxHeight: "90vh",
//       overflowY: "auto",
//     }}>
//       {children}
//     </div>
//   </div>
// );

// // Category Checkbox Component
// const CategoryCheckbox = ({ categories, selectedCategory, onSelect }) => (
//   <div style={{
//     display: "grid",
//     gridTemplateColumns: "repeat(2, 1fr)",
//     gap: "8px",
//     border: "1px solid #ccc",
//     padding: "12px",
//     borderRadius: "6px",
//     maxHeight: "200px",
//     overflowY: "auto"
//   }}>
//     {categories.map(cat => (
//       <label
//         key={cat.name}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "6px",
//           cursor: "pointer",
//           backgroundColor: selectedCategory === cat.name ? "#e0f2fe" : "transparent",
//           borderRadius: "4px",
//           transition: "background-color 0.2s"
//         }}
//       >
//         <input
//           type="radio"
//           checked={selectedCategory === cat.name}
//           onChange={() => onSelect(cat.name)}
//           style={{ marginRight: "8px" }}
//         />
//         <span style={{ fontWeight: selectedCategory === cat.name ? "600" : "400" }}>
//           {cat.name}
//         </span>
//       </label>
//     ))}
//   </div>
// );

// // Subcategory Checkbox Component
// const SubcategoryCheckbox = ({ subcategories, selectedSubcategories, onToggle }) => (
//   <div style={{
//     display: "grid",
//     gridTemplateColumns: "repeat(2, 1fr)",
//     gap: "8px",
//     border: "1px solid #ccc",
//     padding: "12px",
//     borderRadius: "6px",
//     maxHeight: "200px",
//     overflowY: "auto",
//     backgroundColor: subcategories.length === 0 ? "#f9fafb" : "transparent"
//   }}>
//     {subcategories.length === 0 ? (
//       <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280", margin: 0 }}>
//         Please select a category first
//       </p>
//     ) : (
//       subcategories.map(sub => (
//         <label
//           key={sub}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "6px",
//             cursor: "pointer",
//             backgroundColor: selectedSubcategories.includes(sub) ? "#dbeafe" : "transparent",
//             borderRadius: "4px",
//             transition: "background-color 0.2s"
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <input
//               type="checkbox"
//               checked={selectedSubcategories.includes(sub)}
//               onChange={() => onToggle(sub)}
//               style={{ marginRight: "8px" }}
//             />
//             <span>{sub}</span>
//           </div>
//           {selectedSubcategories.includes(sub) && (
//             <FaTimes
//               onClick={(e) => {
//                 e.preventDefault();
//                 onToggle(sub);
//               }}
//               style={{
//                 color: "#ef4444",
//                 cursor: "pointer",
//                 fontSize: "12px"
//               }}
//             />
//           )}
//         </label>
//       ))
//     )}
//   </div>
// );

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   // Form data state
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     subCategories: [],
//     duration: 0,
//     level: "Beginner",
//     price: 0,
//     status: "Active",
//   });

//   // Custom category/subcategory input
//   const [customCategory, setCustomCategory] = useState("");
//   const [customSubcategory, setCustomSubcategory] = useState("");

//   // Fetch courses
//   const fetchCourses = async () => {
//     try {
//       const data = await getCourses();
//       if (Array.isArray(data)) {
//         setCourses(data);
//       } else if (Array.isArray(data.courses)) {
//         setCourses(data.courses);
//       } else {
//         setCourses([]);
//       }
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       alert("Failed to fetch courses");
//       setCourses([]);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Open add form
//   const openAddForm = () => {
//     setEditingId(null);
//     setFormData({
//       title: "",
//       description: "",
//       category: "",
//       subCategories: [],
//       duration: 0,
//       level: "Beginner",
//       price: 0,
//       status: "Active",
//     });
//     setCustomCategory("");
//     setCustomSubcategory("");
//     setShowForm(true);
//   };

//   // Open edit form
//   const openEditForm = (course) => {
//     setEditingId(course._id);
//     setFormData({
//       title: course.title || "",
//       description: course.description || "",
//       category: course.category || "",
//       subCategories: course.subCategories || [],
//       duration: course.duration || 0,
//       level: course.level || "Beginner",
//       price: course.price || 0,
//       status: course.status || "Active",
//     });
//     setCustomCategory("");
//     setCustomSubcategory("");
//     setShowForm(true);
//   };

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle category selection
//   const handleCategorySelect = (categoryName) => {
//     setFormData({ ...formData, category: categoryName, subCategories: [] });
//   };

//   // Handle subcategory toggle
//   const handleSubcategoryToggle = (subcategory) => {
//     setFormData(prev => ({
//       ...prev,
//       subCategories: prev.subCategories.includes(subcategory)
//         ? prev.subCategories.filter(s => s !== subcategory)
//         : [...prev.subCategories, subcategory]
//     }));
//   };

//   // Add custom category
//   const handleAddCustomCategory = () => {
//     if (customCategory.trim() && !CATEGORIES.find(c => c.name === customCategory.trim())) {
//       setFormData({ ...formData, category: customCategory.trim(), subCategories: [] });
//       setCustomCategory("");
//     }
//   };

//   // Add custom subcategory
//   const handleAddCustomSubcategory = () => {
//     if (customSubcategory.trim() && !formData.subCategories.includes(customSubcategory.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         subCategories: [...prev.subCategories, customSubcategory.trim()]
//       }));
//       setCustomSubcategory("");
//     }
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = { ...formData };

//       // Convert subCategories to JSON string if backend expects string
//       if (Array.isArray(payload.subCategories)) {
//         payload.subCategories = JSON.stringify(payload.subCategories);
//       }

//       if (editingId) {
//         await updateCourse(editingId, payload);
//         alert("Course updated successfully");
//       } else {
//         await createCourse(payload);
//         alert("Course added successfully");
//       }

//       setShowForm(false);
//       fetchCourses();
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       alert(error.response?.data?.message || "Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete course
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this course?")) return;

//     try {
//       await deleteCourse(id);
//       fetchCourses();
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       alert("Delete failed");
//     }
//   };

//   // Get available subcategories for selected category
//   const getAvailableSubcategories = () => {
//     const selectedCat = CATEGORIES.find(c => c.name === formData.category);
//     return selectedCat ? selectedCat.subcategories : [];
//   };

//   // ✅ NEW: Check if course is free or paid
//   const isCourseType = (price) => {
//     return price > 0 ? "Paid" : "Free";
//   };

//   // Filter courses
//   const filteredCourses = Array.isArray(courses)
//     ? courses.filter(
//         (course) =>
//           course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           course.subCategories?.some((sub) =>
//             sub.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//       )
//     : [];

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />

//       <div style={{
//         marginLeft: "250px",
//         backgroundColor: "#f3f4f6",
//         minHeight: "100vh",
//         padding: "24px",
//         flex: 1,
//       }}>
//         <h1 style={{ marginBottom: "20px" }}>📚 Courses Management</h1>

//         {/* Table Section */}
//         <div style={{ background: "#fff", padding: "20px", borderRadius: "12px" }}>
//           <div style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: "15px",
//             alignItems: "center",
//           }}>
//             <h3>All Courses</h3>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <input
//                 type="text"
//                 placeholder="Search Courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{
//                   padding: "8px 12px",
//                   borderRadius: "8px",
//                   border: "1px solid #d1d5db",
//                 }}
//               />
//               <button
//                 onClick={openAddForm}
//                 style={{
//                   background: "#f97316",
//                   color: "#fff",
//                   border: "none",
//                   padding: "8px 16px",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                 }}
//               >
//                 + New Course
//               </button>
//             </div>
//           </div>

//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead style={{ background: "#fafafa" }}>
//                 <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
//                   <th style={{ padding: "12px", textAlign: "left" }}>#</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Title</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Subcategories</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Duration</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Level</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Price</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
//                   <th style={{ padding: "12px", textAlign: "center" }}>Edit</th>
//                   <th style={{ padding: "12px", textAlign: "center" }}>Delete</th>
//                   <th style={{ padding: "12px", textAlign: "center" }}>Lectures</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCourses.length === 0 ? (
//                   <tr>
//                     <td colSpan="12" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
//                       No courses found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredCourses.map((course, index) => (
//                     <tr key={course._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                       <td style={{ padding: "12px" }}>{index + 1}</td>
//                       <td style={{ padding: "12px" }}>{course.title}</td>
//                       <td style={{ padding: "12px" }}>
//                         <span style={{
//                           background: "#e0e7ff",
//                           color: "#4338ca",
//                           padding: "4px 8px",
//                           borderRadius: "6px",
//                           fontSize: "12px",
//                           fontWeight: "500"
//                         }}>
//                           {course.category}
//                         </span>
//                       </td>
//                       <td style={{ padding: "12px" }}>
//                         {course.subCategories?.map((sub, i) => (
//                           <span key={i} style={{
//                             background: "#dbeafe",
//                             color: "#1e40af",
//                             padding: "2px 6px",
//                             borderRadius: "4px",
//                             marginRight: "4px",
//                             fontSize: "11px",
//                             display: "inline-block",
//                             marginBottom: "2px"
//                           }}>
//                             {sub}
//                           </span>
//                         )) || "-"}
//                       </td>
//                       <td style={{ padding: "12px" }}>{course.duration}h</td>
//                       <td style={{ padding: "12px" }}>{course.level}</td>
//                       <td style={{ padding: "12px", fontWeight: "600" }}>
//                         ${course.price}
//                       </td>
//                       {/* ✅ NEW: Type Column */}
//                       <td style={{ padding: "12px" }}>
//                         <span style={{
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: "4px",
//                           background: course.price > 0 ? "#fef3c7" : "#d1fae5",
//                           color: course.price > 0 ? "#92400e" : "#065f46",
//                           padding: "4px 8px",
//                           borderRadius: "6px",
//                           fontSize: "12px",
//                           fontWeight: "600"
//                         }}>
//                           {course.price > 0 ? <FaLock size={10} /> : <FaUnlock size={10} />}
//                           {isCourseType(course.price)}
//                         </span>
//                       </td>
//                       <td style={{ padding: "12px" }}>
//                         <span style={{
//                           color: course.status === "Active" ? "#16a34a" : "#dc2626",
//                           fontWeight: "500"
//                         }}>
//                           {course.status}
//                         </span>
//                       </td>
//                       <td style={{ padding: "12px", textAlign: "center" }}>
//                         <button
//                           onClick={() => openEditForm(course)}
//                           style={{
//                             background: "#fde047",
//                             border: "none",
//                             padding: "6px 10px",
//                             borderRadius: "6px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           <FaEdit />
//                         </button>
//                       </td>
//                       <td style={{ padding: "12px", textAlign: "center" }}>
//                         <button
//                           onClick={() => handleDelete(course._id)}
//                           style={{
//                             background: "#ef4444",
//                             color: "#fff",
//                             border: "none",
//                             padding: "6px 10px",
//                             borderRadius: "6px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           <FaTrash />
//                         </button>
//                       </td>
//                       <td style={{ padding: "12px", textAlign: "center" }}>
//                         <button
//                           onClick={() => navigate(`/lectures/${course._id}`)}
//                           style={{
//                             background: "#3b82f6",
//                             color: "#fff",
//                             border: "none",
//                             padding: "6px 10px",
//                             borderRadius: "6px",
//                             cursor: "pointer",
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: "4px"
//                           }}
//                         >
//                           <FaVideo /> View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Add/Edit Form Modal */}
//         {showForm && (
//           <Modal onClose={() => setShowForm(false)}>
//             <h3 style={{ marginBottom: "20px" }}>
//               {editingId ? "Edit Course" : "Add New Course"}
//             </h3>
//             <form
//               onSubmit={handleSubmit}
//               style={{ display: "flex", flexDirection: "column", gap: "14px" }}
//             >
//               <div>
//                 <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                   Course Title
//                 </label>
//                 <input
//                   name="title"
//                   placeholder="Enter course title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     width: "100%",
//                     padding: "8px",
//                     borderRadius: "6px",
//                     border: "1px solid #ccc"
//                   }}
//                 />
//               </div>

//               <div>
//                 <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   placeholder="Enter course description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   required
//                   rows={4}
//                   style={{
//                     width: "100%",
//                     padding: "8px",
//                     borderRadius: "6px",
//                     border: "1px solid #ccc",
//                     resize: "vertical"
//                   }}
//                 />
//               </div>

//               <div>
//                 <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                   Category
//                 </label>
//                 <CategoryCheckbox
//                   categories={CATEGORIES}
//                   selectedCategory={formData.category}
//                   onSelect={handleCategorySelect}
//                 />
//                 <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
//                   <input
//                     type="text"
//                     placeholder="Or add custom category"
//                     value={customCategory}
//                     onChange={(e) => setCustomCategory(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomCategory())}
//                     style={{
//                       flex: 1,
//                       padding: "6px 8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc",
//                       fontSize: "13px"
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddCustomCategory}
//                     style={{
//                       background: "#10b981",
//                       color: "#fff",
//                       border: "none",
//                       padding: "6px 12px",
//                       borderRadius: "6px",
//                       cursor: "pointer",
//                       fontSize: "13px"
//                     }}
//                   >
//                     <FaPlus />
//                   </button>
//                 </div>
//                 {formData.category && (
//                   <div style={{ marginTop: "8px", fontSize: "13px", color: "#059669" }}>
//                     Selected: <strong>{formData.category}</strong>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                   Subcategories
//                 </label>
//                 <SubcategoryCheckbox
//                   subcategories={getAvailableSubcategories()}
//                   selectedSubcategories={formData.subCategories}
//                   onToggle={handleSubcategoryToggle}
//                 />
//                 <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
//                   <input
//                     type="text"
//                     placeholder="Or add custom subcategory"
//                     value={customSubcategory}
//                     onChange={(e) => setCustomSubcategory(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomSubcategory())}
//                     disabled={!formData.category}
//                     style={{
//                       flex: 1,
//                       padding: "6px 8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc",
//                       fontSize: "13px"
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddCustomSubcategory}
//                     disabled={!formData.category}
//                     style={{
//                       background: formData.category ? "#10b981" : "#9ca3af",
//                       color: "#fff",
//                       border: "none",
//                       padding: "6px 12px",
//                       borderRadius: "6px",
//                       cursor: formData.category ? "pointer" : "not-allowed",
//                       fontSize: "13px"
//                     }}
//                   >
//                     <FaPlus />
//                   </button>
//                 </div>
//                 {formData.subCategories.length > 0 && (
//                   <div style={{ marginTop: "8px", fontSize: "13px" }}>
//                     <strong>Selected:</strong>{" "}
//                     {formData.subCategories.map((sub, i) => (
//                       <span key={i} style={{
//                         background: "#dbeafe",
//                         padding: "2px 6px",
//                         borderRadius: "4px",
//                         marginRight: "4px",
//                         display: "inline-block",
//                         marginBottom: "4px"
//                       }}>
//                         {sub}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                     Duration (hours)
//                   </label>
//                   <input
//                     name="duration"
//                     type="number"
//                     placeholder="Duration"
//                     value={formData.duration}
//                     onChange={handleChange}
//                     min="0"
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc"
//                     }}
//                   />
//                 </div>

//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                     Price ($) {/* ✅ Added helper text */}
//                     <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "400", marginLeft: "4px" }}>
//                       (0 = Free Course)
//                     </span>
//                   </label>
//                   <input
//                     name="price"
//                     type="number"
//                     placeholder="0 for free, or enter amount"
//                     value={formData.price}
//                     onChange={handleChange}
//                     min="0"
//                     step="0.01"
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc"
//                     }}
//                   />
//                   {/* ✅ Price indicator */}
//                   {formData.price > 0 ? (
//                     <div style={{ 
//                       marginTop: "4px", 
//                       fontSize: "12px", 
//                       color: "#92400e",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "4px"
//                     }}>
//                       <FaLock size={10} /> This will be a paid course
//                     </div>
//                   ) : (
//                     <div style={{ 
//                       marginTop: "4px", 
//                       fontSize: "12px", 
//                       color: "#065f46",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "4px"
//                     }}>
//                       <FaUnlock size={10} /> This will be a free course
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                     Level
//                   </label>
//                   <select
//                     name="level"
//                     value={formData.level}
//                     onChange={handleChange}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc"
//                     }}
//                   >
//                     <option value="Beginner">Beginner</option>
//                     <option value="Intermediate">Intermediate</option>
//                     <option value="Advanced">Advanced</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc"
//                     }}
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   style={{
//                     background: "#3b82f6",
//                     color: "#fff",
//                     border: "none",
//                     padding: "10px",
//                     borderRadius: "6px",
//                     flex: 1,
//                     cursor: loading ? "not-allowed" : "pointer",
//                     opacity: loading ? 0.7 : 1
//                   }}
//                 >
//                   {loading ? "Saving..." : editingId ? "Update Course" : "Add Course"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   style={{
//                     background: "#ef4444",
//                     color: "#fff",
//                     border: "none",
//                     padding: "10px",
//                     borderRadius: "6px",
//                     flex: 1,
//                     cursor: "pointer"
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </Modal>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Courses;











import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { 
  FaEdit, 
  FaTrash, 
  FaVideo, 
  FaPlus, 
  FaTimes, 
  FaDollarSign, 
  FaLock, 
  FaUnlock,
  FaUsers,
  FaRupeeSign,
  FaChartLine,
  FaGraduationCap,
  FaMoneyBillWave,
  FaArrowRight,
  FaSearch,
  FaSort,
  FaFilter,
  FaTags
} from "react-icons/fa";

import { 
  getCourses, 
  deleteCourse, 
  updateCourse, 
  createCourse,
  getAdminEnrollments,
  getAdminPayments 
} from "../api/api";

// Exact Color Theme from UsersPage
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
  info: "#3B82F6",
  orange: "#F97316",
  primaryButton: "#3D1A5B",
  formButton: "#3B82F6",
  cancelButton: "#6B7280",
  blueLight: "#dbeafe",
  greenLight: "#d1fae5",
  yellowLight: "#fef3c7",
  purpleLight: "#ede9fe",
  teal: "#0d9488",
  indigo: "#4f46e5",
  rose: "#f43f5e"
};

// Predefined categories and subcategories with additional design tools
const CATEGORIES = [
  { 
    name: "Programming", 
    subcategories: ["Python", "JavaScript", "Java", "C++", "PHP", "Ruby", "Go", "Swift"]
  },
  { 
    name: "Web Development", 
    subcategories: ["Frontend", "Backend", "Full Stack", "React", "Angular", "Vue.js", "Node.js"]
  },
  { 
    name: "Data Science", 
    subcategories: ["Machine Learning", "AI", "Data Analysis", "Big Data", "Statistics", "Deep Learning"]
  },
  { 
    name: "Mobile Development", 
    subcategories: ["iOS", "Android", "React Native", "Flutter", "Kotlin", "Swift"]
  },
  { 
    name: "Design", 
    subcategories: ["UI/UX", "Graphic Design", "Web Design", "Adobe Photoshop", "Figma", "Adobe XD", "Illustrator", "Canva"]
  },
  { 
    name: "Business", 
    subcategories: ["Marketing", "Finance", "Management", "Entrepreneurship", "Sales", "Leadership"]
  },
  { 
    name: "Cloud Computing", 
    subcategories: ["AWS", "Azure", "Google Cloud", "DevOps", "Docker", "Kubernetes"]
  },
  { 
    name: "Database", 
    subcategories: ["MySQL", "MongoDB", "PostgreSQL", "Redis", "Firebase", "Oracle"]
  },
  { 
    name: "Design Tools", 
    subcategories: ["Illustrator", "Canva", "Photoshop", "Figma", "Sketch", "InDesign", "CorelDRAW", "Affinity Designer"]
  },
];

// Modal Component matching UsersPage
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

// Category Checkbox Component
const CategoryCheckbox = ({ categories, selectedCategory, onSelect, isMobile }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
    gap: "8px",
    border: `1px solid ${COLORS.darkGray}`,
    padding: "12px",
    borderRadius: "8px",
    maxHeight: "200px",
    overflowY: "auto",
    background: COLORS.lightGray,
  }}>
    {categories.map(cat => (
      <label
        key={cat.name}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px",
          cursor: "pointer",
          backgroundColor: selectedCategory === cat.name ? COLORS.roleBg : "transparent",
          borderRadius: "6px",
          transition: "background-color 0.2s",
          color: selectedCategory === cat.name ? COLORS.deepPurple : COLORS.textGray,
        }}
      >
        <input
          type="radio"
          checked={selectedCategory === cat.name}
          onChange={() => onSelect(cat.name)}
          style={{ 
            marginRight: "8px",
            accentColor: COLORS.deepPurple
          }}
        />
        <span style={{ 
          fontWeight: selectedCategory === cat.name ? "600" : "400",
          fontSize: "14px"
        }}>
          {cat.name}
        </span>
      </label>
    ))}
  </div>
);

// Subcategory Checkbox Component
const SubcategoryCheckbox = ({ subcategories, selectedSubcategories, onToggle, isMobile }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
    gap: "8px",
    border: `1px solid ${COLORS.darkGray}`,
    padding: "12px",
    borderRadius: "8px",
    maxHeight: "200px",
    overflowY: "auto",
    backgroundColor: subcategories.length === 0 ? COLORS.bgGray : COLORS.lightGray
  }}>
    {subcategories.length === 0 ? (
      <p style={{ 
        gridColumn: "1 / -1", 
        textAlign: "center", 
        color: COLORS.darkGray, 
        margin: 0,
        fontSize: "14px"
      }}>
        Please select a category first
      </p>
    ) : (
      subcategories.map(sub => (
        <label
          key={sub}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: selectedSubcategories.includes(sub) ? COLORS.blueLight : "transparent",
            borderRadius: "6px",
            transition: "background-color 0.2s",
            color: COLORS.textGray
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={selectedSubcategories.includes(sub)}
              onChange={() => onToggle(sub)}
              style={{ 
                marginRight: "8px",
                accentColor: COLORS.deepPurple
              }}
            />
            <span style={{ fontSize: "14px" }}>{sub}</span>
          </div>
          {selectedSubcategories.includes(sub) && (
            <FaTimes
              onClick={(e) => {
                e.preventDefault();
                onToggle(sub);
              }}
              style={{
                color: COLORS.danger,
                cursor: "pointer",
                fontSize: "12px"
              }}
            />
          )}
        </label>
      ))
    )}
  </div>
);

// Subcategory badge component - shows subcategories as styled badges
const SubcategoryBadge = ({ subcategories, isMobile }) => {
  if (!subcategories || !Array.isArray(subcategories) || subcategories.length === 0) {
    return <span style={{ color: COLORS.darkGray, fontSize: isMobile ? "11px" : "12px" }}>No subcategories</span>;
  }

  // Parse subcategories if they're stored as JSON string
  let subcats = subcategories;
  if (typeof subcategories === 'string') {
    try {
      subcats = JSON.parse(subcategories);
    } catch (e) {
      subcats = subcategories.split(',');
    }
  }

  // Take only first 2 subcategories for display, show +more if there are more
  const displaySubcats = subcats.slice(0, 2);
  const hasMore = subcats.length > 2;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }}>
      {displaySubcats.map((sub, index) => (
        <span
          key={index}
          style={{
            background: getSubcategoryColor(sub),
            color: "#FFFFFF",
            padding: isMobile ? "2px 6px" : "3px 8px",
            borderRadius: "4px",
            fontSize: isMobile ? "10px" : "11px",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            gap: "3px"
          }}
        >
          <FaTags size={isMobile ? 8 : 9} /> {sub}
        </span>
      ))}
      {hasMore && (
        <span style={{
          background: COLORS.darkGray,
          color: COLORS.white,
          padding: isMobile ? "2px 6px" : "3px 8px",
          borderRadius: "4px",
          fontSize: isMobile ? "10px" : "11px",
          fontWeight: "500"
        }}>
          +{subcats.length - 2} more
        </span>
      )}
    </div>
  );
};

// Function to assign colors based on subcategory
const getSubcategoryColor = (subcategory) => {
  const colorMap = {
    // Design tools
    'Illustrator': '#FF9A00',
    'Canva': '#00C4CC',
    'Photoshop': '#31A8FF',
    'Figma': '#F24E1E',
    'Sketch': '#FDAD00',
    'InDesign': '#FF3366',
    'CorelDRAW': '#CC0000',
    'Affinity Designer': '#1B72BE',
    
    // Programming
    'Python': '#3776AB',
    'JavaScript': '#F7DF1E',
    'Java': '#007396',
    'C++': '#00599C',
    'React': '#61DAFB',
    'Angular': '#DD0031',
    'Vue.js': '#4FC08D',
    'Node.js': '#339933',
    
    // Cloud
    'AWS': '#FF9900',
    'Azure': '#0089D6',
    'Google Cloud': '#4285F4',
    'Docker': '#2496ED',
    'Kubernetes': '#326CE5',
    
    // Data Science
    'Machine Learning': '#FF6B6B',
    'AI': '#4ECDC4',
    'Data Analysis': '#45B7D1',
    'Big Data': '#96CEB4',
    
    // Design categories
    'UI/UX': '#6C5CE7',
    'Graphic Design': '#E17055',
    'Web Design': '#0984E3',
  };

  return colorMap[subcategory] || COLORS.deepPurple;
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    paidCourses: 0,
    freeCourses: 0
  });
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategories: [],
    duration: 0,
    level: "Beginner",
    price: 0,
    status: "Active",
  });

  // Custom category/subcategory input
  const [customCategory, setCustomCategory] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const coursesData = await getCourses();
      const coursesArray = Array.isArray(coursesData) 
        ? coursesData 
        : Array.isArray(coursesData?.courses) 
          ? coursesData.courses 
          : [];
      setCourses(coursesArray);
      
      // Fetch enrollments for admin
      try {
        const enrollmentsData = await getAdminEnrollments();
        setEnrollments(enrollmentsData?.enrollments || []);
      } catch (err) {
        console.warn("Could not fetch enrollments:", err);
        setEnrollments([]);
      }
      
      // Fetch payments for admin
      try {
        const paymentsData = await getAdminPayments();
        setPayments(paymentsData?.payments || []);
      } catch (err) {
        console.warn("Could not fetch payments:", err);
        setPayments([]);
      }
      
      // Calculate statistics
      calculateStatistics(coursesArray);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (coursesArray) => {
    const totalCourses = coursesArray.length;
    const paidCourses = coursesArray.filter(c => c.price > 0).length;
    const freeCourses = coursesArray.filter(c => c.price === 0).length;
    
    // Calculate revenue from enrollments
    let totalRevenue = 0;
    let enrolledStudents = new Set();
    
    if (enrollments.length > 0) {
      enrollments.forEach(enrollment => {
        if (enrollment.isPaid && enrollment.coursePrice) {
          totalRevenue += enrollment.coursePrice;
        }
        if (enrollment.studentId) {
          enrolledStudents.add(enrollment.studentId);
        }
      });
    }
    
    setStats({
      totalCourses,
      totalStudents: enrolledStudents.size,
      totalRevenue,
      paidCourses,
      freeCourses
    });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Open add form
  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      subCategories: [],
      duration: 0,
      level: "Beginner",
      price: 0,
      status: "Active",
    });
    setCustomCategory("");
    setCustomSubcategory("");
    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (course) => {
    setEditingId(course._id);
    
    // Parse subCategories if they're stored as JSON string
    let subCategoriesArray = [];
    if (course.subCategories) {
      if (typeof course.subCategories === 'string') {
        try {
          subCategoriesArray = JSON.parse(course.subCategories);
        } catch (e) {
          subCategoriesArray = course.subCategories.split(',');
        }
      } else if (Array.isArray(course.subCategories)) {
        subCategoriesArray = course.subCategories;
      }
    }
    
    setFormData({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      subCategories: subCategoriesArray,
      duration: course.duration || 0,
      level: course.level || "Beginner",
      price: course.price || 0,
      status: course.status || "Active",
    });
    setCustomCategory("");
    setCustomSubcategory("");
    setShowForm(true);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle category selection
  const handleCategorySelect = (categoryName) => {
    setFormData({ ...formData, category: categoryName, subCategories: [] });
  };

  // Handle subcategory toggle
  const handleSubcategoryToggle = (subcategory) => {
    setFormData(prev => ({
      ...prev,
      subCategories: prev.subCategories.includes(subcategory)
        ? prev.subCategories.filter(s => s !== subcategory)
        : [...prev.subCategories, subcategory]
    }));
  };

  // Add custom category
  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !CATEGORIES.find(c => c.name === customCategory.trim())) {
      setFormData({ ...formData, category: customCategory.trim(), subCategories: [] });
      setCustomCategory("");
    }
  };

  // Add custom subcategory
  const handleAddCustomSubcategory = () => {
    if (customSubcategory.trim() && !formData.subCategories.includes(customSubcategory.trim())) {
      setFormData(prev => ({
        ...prev,
        subCategories: [...prev.subCategories, customSubcategory.trim()]
      }));
      setCustomSubcategory("");
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };

      // Convert subCategories to JSON string for backend
      if (Array.isArray(payload.subCategories)) {
        payload.subCategories = JSON.stringify(payload.subCategories);
      }

      if (editingId) {
        await updateCourse(editingId, payload);
        alert("Course updated successfully");
      } else {
        await createCourse(payload);
        alert("Course added successfully");
      }

      setShowForm(false);
      fetchAllData();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This will also remove all enrollments.")) return;

    try {
      await deleteCourse(id);
      fetchAllData();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Delete failed");
    }
  };

  // Get available subcategories for selected category
  const getAvailableSubcategories = () => {
    const selectedCat = CATEGORIES.find(c => c.name === formData.category);
    return selectedCat ? selectedCat.subcategories : [];
  };

  // Check if course is free or paid
  const isCourseType = (price) => {
    return price > 0 ? "Paid" : "Free";
  };

  // Get enrollments count for a course
  const getCourseEnrollmentsCount = (courseId) => {
    return enrollments.filter(e => e.courseId === courseId).length;
  };

  // Get paid enrollments count for a course
  const getPaidEnrollmentsCount = (courseId) => {
    return enrollments.filter(e => e.courseId === courseId && e.isPaid).length;
  };

  // Get revenue for a course
  const getCourseRevenue = (courseId) => {
    const courseEnrollments = enrollments.filter(e => e.courseId === courseId && e.isPaid);
    return courseEnrollments.reduce((sum, e) => sum + (e.coursePrice || 0), 0);
  };

  // Filter courses
  const filteredCourses = Array.isArray(courses)
    ? courses.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.subCategories && 
            (typeof course.subCategories === 'string'
              ? course.subCategories.toLowerCase().includes(searchTerm.toLowerCase())
              : course.subCategories.some((sub) =>
                  sub.toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
          )
      )
    : [];

  return (
    <div style={{ display: "flex", backgroundColor: COLORS.bgGray, minHeight: "100vh" }}>
      <Sidebar />

      <div style={{
        flex: 1,
        overflowX: "hidden",
        marginLeft: isMobile ? "0" : "280px",
        paddingTop: isMobile ? "80px" : "32px",
        padding: isMobile ? "80px 16px 32px 16px" : "32px",
      }}>
        {/* Header Section */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <div>
              <h1 style={{
                fontSize: isMobile ? "24px" : "28px",
                fontWeight: "700",
                color: COLORS.deepPurple,
                margin: 0,
                marginBottom: "8px",
              }}>
                📚 Courses Management
              </h1>
              <p style={{ 
                color: COLORS.textGray, 
                margin: 0, 
                fontSize: isMobile ? "13px" : "14px" 
              }}>
                Manage all courses, subcategories, and enrollments
              </p>
            </div>
            {/* Only show total courses card - moved to top right */}
            <div style={{
              background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
              border: "1px solid rgba(61, 26, 91, 0.2)",
              borderRadius: "8px",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: COLORS.blueLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                color: COLORS.info
              }}>
                <FaGraduationCap />
              </div>
              <div>
                <p style={{
                  color: COLORS.deepPurple,
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: 0,
                  marginBottom: "2px"
                }}>
                  Total Courses
                </p>
                <p style={{
                  color: COLORS.deepPurple,
                  fontSize: "24px",
                  fontWeight: "700",
                  margin: 0
                }}>
                  {stats.totalCourses}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Add Button Row - Removed View All Enrollments button */}
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
                placeholder="Search courses by title, category, or subcategory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  padding: isMobile ? "12px 16px 12px 48px" : "14px 16px 14px 48px", 
                  borderRadius: "8px", 
                  border: `1px solid #D1D5DB`,
                  width: "100%",
                  fontSize: isMobile ? "14px" : "15px",
                  background: COLORS.white,
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
            
            {/* Only Add New Course button - Changed to purple */}
            <button
              onClick={openAddForm}
              style={{
                background: COLORS.primaryButton, // Changed from orange to purple
                color: COLORS.white,
                border: "none",
                padding: isMobile ? "12px 24px" : "14px 28px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: isMobile ? "13px" : "15px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(139, 92, 246, 0.2)",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#7C3AED"}
              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primaryButton}
            >
              <FaPlus /> {isMobile ? "Add Course" : "New Course"}
            </button>
          </div>

          {/* Courses Table */}
          <div style={{
            background: COLORS.white,
            borderRadius: "12px",
            overflow: isMobile ? "auto" : "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              minWidth: isMobile ? "1100px" : "auto"
            }}>
              <thead>
                <tr style={{ 
                  background: COLORS.headerPurple,
                  color: COLORS.white
                }}>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "12px" : "15px", 
                    fontWeight: "700" 
                  }}>#</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "12px" : "15px", 
                    fontWeight: "700" 
                  }}>Title</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "12px" : "15px", 
                    fontWeight: "700" 
                  }}>Category</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "12px" : "15px", 
                    fontWeight: "700" 
                  }}>Subcategories</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "12px" : "15px", 
                    fontWeight: "700" 
                  }}>Price/Type</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "12px" : "15px", 
                    fontWeight: "700" 
                  }}>Enrollments</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "12px" : "15px", 
                    fontWeight: "700" 
                  }}>Revenue</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "left", 
                    fontSize: isMobile ? "12px" : "15px", 
                    fontWeight: "700" 
                  }}>Status</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "center", 
                    fontSize: isMobile ? "12px" : "15px", 
                    fontWeight: "700" 
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ 
                      padding: "40px", 
                      textAlign: "center", 
                      color: COLORS.darkGray,
                      fontSize: isMobile ? "14px" : "15px"
                    }}>
                      No courses found
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course, index) => {
                    const enrollmentsCount = getCourseEnrollmentsCount(course._id);
                    const paidEnrollmentsCount = getPaidEnrollmentsCount(course._id);
                    const courseRevenue = getCourseRevenue(course._id);
                    
                    return (
                      <tr key={course._id} style={{ 
                        borderBottom: `1px solid ${COLORS.lightGray}`,
                        background: index % 2 === 0 ? COLORS.white : COLORS.bgGray
                      }}>
                        <td style={{ 
                          padding: isMobile ? "14px 12px" : "18px 24px", 
                          color: COLORS.textGray, 
                          fontWeight: "600", 
                          fontSize: isMobile ? "13px" : "15px" 
                        }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                          <div style={{ 
                            fontWeight: "600", 
                            color: COLORS.deepPurple,
                            fontSize: isMobile ? "13px" : "15px",
                            marginBottom: "4px"
                          }}>
                            {course.title}
                          </div>
                          <div style={{ 
                            fontSize: isMobile ? "11px" : "12px", 
                            color: COLORS.darkGray
                          }}>
                            {course.duration}h • {course.level}
                          </div>
                        </td>
                        <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                          <span style={{
                            background: COLORS.roleBg,
                            color: COLORS.deepPurple,
                            padding: isMobile ? "4px 8px" : "6px 12px",
                            borderRadius: "6px",
                            fontSize: isMobile ? "11px" : "13px",
                            fontWeight: "600",
                            display: "inline-block",
                          }}>
                            {course.category}
                          </span>
                        </td>
                        <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                          <SubcategoryBadge 
                            subcategories={course.subCategories} 
                            isMobile={isMobile}
                          />
                        </td>
                        <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <span style={{ 
                              fontWeight: "700", 
                              color: course.price > 0 ? "#92400e" : "#065f46",
                              fontSize: isMobile ? "14px" : "15px"
                            }}>
                              ₹{course.price}
                            </span>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              background: course.price > 0 ? COLORS.yellowLight : COLORS.greenLight,
                              color: course.price > 0 ? "#92400e" : "#065f46",
                              padding: isMobile ? "3px 6px" : "4px 8px",
                              borderRadius: "6px",
                              fontSize: isMobile ? "10px" : "12px",
                              fontWeight: "600",
                              width: "fit-content"
                            }}>
                              {course.price > 0 ? <FaLock size={10} /> : <FaUnlock size={10} />}
                              {isCourseType(course.price)}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ 
                              fontWeight: "600", 
                              color: COLORS.deepPurple,
                              fontSize: isMobile ? "13px" : "14px"
                            }}>
                              {enrollmentsCount} total
                            </span>
                            <span style={{ 
                              fontSize: isMobile ? "11px" : "12px", 
                              color: COLORS.brightGreen,
                              fontWeight: "500"
                            }}>
                              {paidEnrollmentsCount} paid
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                          <div style={{ 
                            fontWeight: "700", 
                            color: "#059669",
                            fontSize: isMobile ? "14px" : "15px",
                            marginBottom: "4px"
                          }}>
                            ₹{courseRevenue}
                          </div>
                          {/* Removed Payments button */}
                        </td>
                        <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                          <span style={{
                            color: course.status === "Active" ? "#16a34a" : COLORS.danger,
                            fontWeight: "600",
                            fontSize: isMobile ? "11px" : "13px",
                            background: course.status === "Active" ? COLORS.greenLight : "#fee2e2",
                            padding: isMobile ? "4px 8px" : "6px 12px",
                            borderRadius: "20px",
                            display: "inline-block"
                          }}>
                            {course.status}
                          </span>
                        </td>
                        <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                          <div style={{ 
                            display: "flex", 
                            gap: isMobile ? "4px" : "8px", 
                            justifyContent: "center",
                            flexWrap: "wrap"
                          }}>
                            <button
                              onClick={() => navigate(`/lectures/${course._id}`)}
                              style={{
                                background: COLORS.info,
                                color: COLORS.white,
                                border: "none",
                                padding: isMobile ? "6px 8px" : "8px 12px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                fontSize: isMobile ? "11px" : "13px",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#2563EB"}
                              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.info}
                              title="Manage Lectures"
                            >
                              <FaVideo size={isMobile ? 10 : 12} /> {isMobile ? "Lec" : "Lectures"}
                            </button>
                            <button
                              onClick={() => openEditForm(course)}
                              style={{
                                background: COLORS.warning,
                                color: COLORS.white,
                                border: "none",
                                padding: isMobile ? "6px 8px" : "8px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: isMobile ? "11px" : "13px",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#D97706"}
                              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.warning}
                              title="Edit Course"
                            >
                              <FaEdit size={isMobile ? 10 : 12} />
                            </button>
                            <button
                              onClick={() => handleDelete(course._id)}
                              style={{
                                background: COLORS.danger,
                                color: COLORS.white,
                                border: "none",
                                padding: isMobile ? "6px 8px" : "8px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: isMobile ? "11px" : "13px",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#DC2626"}
                              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.danger}
                              title="Delete Course"
                            >
                              <FaTrash size={isMobile ? 10 : 12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <div style={{ width: "100%" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px" 
            }}>
              <h3 style={{ 
                color: COLORS.deepPurple, 
                margin: 0, 
                fontSize: isMobile ? "18px" : "20px" 
              }}>
                {editingId ? "Edit Course" : "Add New Course"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: COLORS.deepPurple,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#5B21B6"}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.deepPurple}
              >
                <FaTimes />
              </button>
            </div>
            
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  color: COLORS.textGray, 
                  fontWeight: "600", 
                  fontSize: "14px" 
                }}>
                  Course Title *
                </label>
                <input
                  name="title"
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.darkGray}`,
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  color: COLORS.textGray, 
                  fontWeight: "600", 
                  fontSize: "14px" 
                }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Enter course description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.darkGray}`,
                    fontSize: "14px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  color: COLORS.textGray, 
                  fontWeight: "600", 
                  fontSize: "14px" 
                }}>
                  Category
                </label>
                <CategoryCheckbox
                  categories={CATEGORIES}
                  selectedCategory={formData.category}
                  onSelect={handleCategorySelect}
                  isMobile={isMobile}
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <input
                    type="text"
                    placeholder="Or add custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomCategory())}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    style={{
                      background: COLORS.brightGreen,
                      color: COLORS.white,
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      fontWeight: "600",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#00C9A7"}
                    onMouseLeave={(e) => e.currentTarget.style.background = COLORS.brightGreen}
                  >
                    <FaPlus /> Add
                  </button>
                </div>
                {formData.category && (
                  <div style={{ 
                    marginTop: "8px", 
                    fontSize: "13px", 
                    color: "#059669",
                    padding: "6px 12px",
                    background: COLORS.greenLight,
                    borderRadius: "6px",
                    display: "inline-block"
                  }}>
                    Selected: <strong>{formData.category}</strong>
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  color: COLORS.textGray, 
                  fontWeight: "600", 
                  fontSize: "14px" 
                }}>
                  Subcategories
                </label>
                <SubcategoryCheckbox
                  subcategories={getAvailableSubcategories()}
                  selectedSubcategories={formData.subCategories}
                  onToggle={handleSubcategoryToggle}
                  isMobile={isMobile}
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <input
                    type="text"
                    placeholder="Or add custom subcategory"
                    value={customSubcategory}
                    onChange={(e) => setCustomSubcategory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomSubcategory())}
                    disabled={!formData.category}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      boxSizing: "border-box",
                      outline: "none",
                      opacity: formData.category ? 1 : 0.5,
                      background: formData.category ? COLORS.white : COLORS.lightGray
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSubcategory}
                    disabled={!formData.category}
                    style={{
                      background: formData.category ? COLORS.brightGreen : COLORS.darkGray,
                      color: COLORS.white,
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      cursor: formData.category ? "pointer" : "not-allowed",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      fontWeight: "600",
                      transition: formData.category ? "all 0.2s ease" : "none"
                    }}
                    onMouseEnter={(e) => {
                      if (formData.category) {
                        e.currentTarget.style.background = "#00C9A7";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.category) {
                        e.currentTarget.style.background = COLORS.brightGreen;
                      }
                    }}
                  >
                    <FaPlus /> Add
                  </button>
                </div>
                {formData.subCategories.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ 
                      color: COLORS.textGray, 
                      fontWeight: "600", 
                      fontSize: "14px", 
                      marginBottom: "6px" 
                    }}>
                      Selected:
                    </div>
                    <div style={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      gap: "6px" 
                    }}>
                      {formData.subCategories.map((sub, i) => (
                        <span key={i} style={{
                          background: getSubcategoryColor(sub),
                          color: "#FFFFFF",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <FaTags size={12} /> {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Two-column grid for desktop */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                gap: "16px" 
              }}>
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "6px", 
                    color: COLORS.textGray, 
                    fontWeight: "600", 
                    fontSize: "14px" 
                  }}>
                    Duration (hours)
                  </label>
                  <input
                    name="duration"
                    type="number"
                    placeholder="Duration in hours"
                    value={formData.duration}
                    onChange={handleChange}
                    min="0"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "6px", 
                    color: COLORS.textGray, 
                    fontWeight: "600", 
                    fontSize: "14px" 
                  }}>
                    Price (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="0 for free course"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                  <div style={{ 
                    marginTop: "8px", 
                    fontSize: "13px", 
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: formData.price > 0 ? COLORS.yellowLight : COLORS.greenLight,
                    color: formData.price > 0 ? "#92400e" : "#065f46",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    {formData.price > 0 ? (
                      <>
                        <FaLock size={14} /> This will be a <strong>PAID</strong> course
                      </>
                    ) : (
                      <>
                        <FaUnlock size={14} /> This will be a <strong>FREE</strong> course
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Two-column grid for desktop */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                gap: "16px" 
              }}>
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "6px", 
                    color: COLORS.textGray, 
                    fontWeight: "600", 
                    fontSize: "14px" 
                  }}>
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      background: COLORS.white,
                      cursor: "pointer",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "6px", 
                    color: COLORS.textGray, 
                    fontWeight: "600", 
                    fontSize: "14px" 
                  }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      background: COLORS.white,
                      cursor: "pointer",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ 
                display: "flex", 
                gap: "12px", 
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: `1px solid ${COLORS.lightGray}`
              }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: COLORS.formButton,
                    color: COLORS.white,
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    flex: 1,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#2563EB";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = COLORS.formButton;
                    }
                  }}
                >
                  {loading ? "Saving..." : editingId ? "Update Course" : "Add Course"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    background: COLORS.cancelButton,
                    color: COLORS.white,
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    flex: 1,
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#4B5563"}
                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Courses;