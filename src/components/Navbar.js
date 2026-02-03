// import React, { useState } from 'react';
// import { FiSearch, FiUser } from 'react-icons/fi';
// import { FaShoppingCart } from 'react-icons/fa';
// import './Navbar.css';
// import logo from '../assets/logo.jpeg';
// import { Link, useNavigate, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogoClick = (e) => {
//     if (location.pathname === '/') {
//       e.preventDefault();
//       window.location.href = '/';
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log('Searching for:', searchQuery);
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
        
//         <Link 
//           to="/" 
//           className="navbar-logo" 
//           style={{ textDecoration: 'none' }}
//           onClick={handleLogoClick}
//         >
//           <img src={logo} alt="ITechSkill Logo" className="logo-image" />
//           <span className="logo-text"><i>ITechSkill</i></span>
//         </Link>

//         <div className="nav-item">
//           <Link 
//             to="/courses" 
//             className="nav-button courses-nav-button"
//             style={{
//               textDecoration: 'none',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}
//           >
//             <span>Courses</span>
//           </Link>
//         </div>

//         {/* Search Bar */}
//         <div className="search-container">
//           <form onSubmit={handleSearch} className="search-form">
//             <div className="search-input-wrapper">
//               <FiSearch className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search Anything...."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//               />
//             </div>
//           </form>
//         </div>

//         {/* Right side navigation items */}
//         <div className="nav-right">
//           {/* Change button to Link */}
//           <Link to="/pricing" className="nav-button pricing-button" style={{ textDecoration: 'none' }}>
//             Pricing & Plans
//           </Link>

//           <button className="nav-button cart-button">
//             <FaShoppingCart className="cart-icon" />
//             <span className="cart-badge">3</span>
//           </button>

//           <button className="nav-button login-button">
//             <FiUser className="login-icon" />
//             <span>Login</span>
//           </button>
//           <button className="nav-button login-button">
//             <FiUser className="login-icon" />
//             <span>Signup</span>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;















import React, { useState, useContext } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.jpeg";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Hide navbar on login/register pages (optional but clean)
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="navbar-logo" style={{ textDecoration: "none" }}>
          <img src={logo} alt="ITechSkill Logo" className="logo-image" />
          <span className="logo-text"><i>ITechSkill</i></span>
        </Link>

        {/* COURSES */}
        <div className="nav-item">
          <Link to="/courses_screen" className="nav-button courses-nav-button">
            Courses
          </Link>
        </div>

        {/* SEARCH */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          <Link to="/pricing" className="nav-button pricing-button">
            Pricing & Plans
          </Link>

          {/* <button className="nav-button cart-button">
            <FaShoppingCart className="cart-icon" />
            <span className="cart-badge">3</span>
          </button> */}

          {/* AUTH ACTIONS */}
          {user ? (
            <>
              <span className="nav-username">
                Hi, {user.fullName || user.name}
              </span>
              <button onClick={logout} className="nav-button login-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button login-button">
                <FiUser className="login-icon" />
                Login
              </Link>

              <Link to="/register" className="nav-button login-button">
                <FiUser className="login-icon" />
                Sign Up
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
