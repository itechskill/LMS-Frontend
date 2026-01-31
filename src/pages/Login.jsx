// import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loginUser } from '../api/api';
// import ATLogo from '../assets/AT.png';
// import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
// import { AuthContext } from '../context/AuthContext';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     role: 'student', // default role
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
//     if (!formData.password) newErrors.password = 'Password is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const response = await loginUser({
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//       });

//       // ✅ Save token in localStorage for API calls
//       if (response.token) {
//         localStorage.setItem('userInfo', JSON.stringify(response));
//       }

//       // Update AuthContext
//       login(response.user);

//       // // Navigate based on role
//       // if (response.user.role.toLowerCase() === 'admin') {
//       //   navigate('/admin/dashboard');
//       // } else {
//       //   navigate('/dashboard');
//       // }
//     if (response.user.role.toLowerCase() === "admin") {
//       navigate("/admin/dashboard");
//     } else {
//       navigate("/student/dashboard");
//     }

//     } catch (error) {
//       console.error('Login error:', error);
//       alert(error.message || 'Login failed. Please check your credentials.');
//       if (error.errors) setErrors(error.errors);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleLogin}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: "15px",
//         width: "350px",
//         margin: "50px auto",
//         padding: "25px",
//         border: "1px solid #ddd",
//         borderRadius: "12px",
//         boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
//         backgroundColor: "#f9f9f9",
//       }}
//     >
//       {/* Logo */}
//       <div style={{ textAlign: "center", marginBottom: "10px" }}>
//         <img src={ATLogo} alt="AT Logo" style={{ width: "100px", marginBottom: "2px" }} />
//       </div>

//       <h2 style={{
//         textAlign: "center",
//         marginBottom: "15px",
//         color: "#2563eb",
//         fontSize: "16px",
//         fontWeight: "700"
//       }}>
//         Learning Management System
//       </h2>

//       {/* Email input */}
//       <div style={{ position: "relative" }}>
//         <FaUser style={{
//           position: "absolute",
//           left: "10px",
//           top: "50%",
//           transform: "translateY(-50%)",
//           color: "#888"
//         }} />
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//           placeholder="Email"
//           style={{
//             width: "87%",
//             padding: "10px 10px 10px 35px",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//             fontSize: "16px"
//           }}
//         />
//         {errors.email && <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>}
//       </div>

//       {/* Password input */}
//       <div style={{ position: "relative" }}>
//         <FaLock style={{
//           position: "absolute",
//           left: "10px",
//           top: "50%",
//           transform: "translateY(-50%)",
//           color: "#888"
//         }} />
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleInputChange}
//           placeholder="Password"
//           style={{
//             width: "87%",
//             padding: "10px 10px 10px 35px",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//             fontSize: "16px"
//           }}
//         />
//         {errors.password && <span style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>}
//       </div>

//       {/* Submit button */}
//       <button
//         type="submit"
//         disabled={loading}
//         style={{
//           padding: "12px",
//           border: "none",
//           borderRadius: "8px",
//           backgroundColor: loading ? "#888" : "#2563eb",
//           color: "#fff",
//           fontWeight: "600",
//           fontSize: "16px",
//           cursor: loading ? "not-allowed" : "pointer",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "8px",
//           transition: "0.3s"
//         }}
//         onMouseOver={e => !loading && (e.currentTarget.style.backgroundColor = "#1e40af")}
//         onMouseOut={e => !loading && (e.currentTarget.style.backgroundColor = "#2563eb")}
//       >
//         <FaSignInAlt /> {loading ? "Logging in..." : "Login"}
//       </button>

//       <p style={{ textAlign: "center", fontSize: "14px" }}>
//         Don’t have an account?{" "}
//         <span
//           style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}
//           onClick={() => navigate('/register')}
//         >
//           Register here
//         </span>
//       </p>
//     </form>
//   );
// };

// export default Login;















import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';
import ITSLogo from '../assets/ITS.png';
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.token) {
        localStorage.setItem('userInfo', JSON.stringify(response));
      }

      login(response.user);

      if (response.user.role.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }

    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
      if (error.errors) setErrors(error.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <div style={styles.logoCircle}>
            <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
          </div>
        </div>

        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subheading}>Sign in to continue to your account</p>

        {/* Email Input */}
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            <FaUser style={styles.icon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              style={styles.inputField}
            />
          </div>
          {errors.email && <span style={styles.error}>{errors.email}</span>}
        </div>

        {/* Password Input */}
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              style={styles.inputField}
            />
            <span 
              style={styles.passwordToggle} 
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <span style={styles.error}>{errors.password}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          <FaSignInAlt /> {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Register Link */}
        <p style={styles.registerText}>
          Don't have an account?{" "}
          <span
            style={styles.registerLink}
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2a043b 20%, #868528 100%)",
    padding: "20px",
  },
  form: {
    width: "100%",
    maxWidth: "450px",
    margin: "0 auto",
    padding: "40px 30px",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    background: "rgba(255, 255, 255, 0.98)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  logoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "10px",
  },
  logoCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#ffffff",
    padding: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(123, 67, 151, 0.4)",
    marginBottom: "15px",
  },
  logoImg: {
    width: "74px",
    height: "74px",
    borderRadius: "50%",
    objectFit: "contain",
    background: "transparent",
  },
  brandTitle: {
    margin: "0 0 5px 0",
    fontSize: "28px",
    fontWeight: "700",
    background: "#693683",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "2px",
  },
  brandTagline: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
    fontWeight: "400",
    letterSpacing: "0.5px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "5px",
    marginTop: "10px",
    color: "#1a1a2e",
    fontSize: "26px",
    fontWeight: "700"
  },
  subheading: {
    textAlign: "center",
    margin: "0 0 10px 0",
    color: "#666",
    fontSize: "14px",
    fontWeight: "400",
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: "15px",
    color: "#888",
    fontSize: "16px",
    zIndex: 1,
  },
  inputField: {
    width: "100%",
    padding: "14px 15px 14px 45px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "15px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "#fff",
  },
  passwordToggle: {
    position: "absolute",
    right: "15px",
    cursor: "pointer",
    color: "#888",
    fontSize: "16px",
    zIndex: 1,
  },
  button: {
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease",
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    marginLeft: "5px",
    fontWeight: "500",
  },
  registerText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    marginTop: "5px",
  },
  registerLink: {
    background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Login;