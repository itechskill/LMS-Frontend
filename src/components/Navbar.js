import React, { useState, useContext } from "react";
import { FiSearch, FiUser, FiMenu, FiX, FiBookOpen, FiDollarSign, FiLogIn, FiUserPlus, FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.jpeg";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add your search logic here
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Hide navbar on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT SECTION - Logo (Circular with white bg) */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img 
              src={logo} 
              alt="ITechSkill Logo" 
              className="logo-image" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/50/ffffff/13032e?text=IT";
              }}
            />
            <span className="logo-text">ITechSkill</span>
          </Link>
        </div>

        {/* CENTER SECTION - Search Bar & Courses */}
        <div className="navbar-center">
          <Link
            to="/courses_screen"
            className="courses-nav-button desktop-only"
            onClick={closeMobileMenu}
          >
            <FiBookOpen className="courses-icon" />
            <span>Courses</span>
          </Link>

          <div className={`search-bar ${isSearchFocused ? "focused" : ""}`}>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                {/* <FiSearch className="search-icon" /> */}
                <input
                  type="text"
                  placeholder="Search for courses, topics, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="search-input"
                />
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SECTION - Navigation Links */}
        <div className="navbar-right">
          {/* Desktop Navigation */}
          <div className="nav-links desktop-only">
            <Link to="/pricing" className="nav-link">
              <FiDollarSign style={{ marginRight: "8px" }} />
              Pricing
            </Link>

            {user ? (
              <>
                <div className="user-welcome">
                  <span className="welcome-text">Welcome,</span>
                  <span className="user-name">{user.fullName || user.name || "User"}</span>
                </div>
                <button onClick={logout} className="nav-button logout-button">
                  <FiLogOut className="button-icon" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-button login-button">
                  <FiLogIn className="button-icon" />
                  <span>Login</span>
                </Link>

                <Link to="/register" className="nav-button signup-button">
                  <FiUserPlus className="button-icon" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-content">
          <Link
            to="/courses_screen"
            className="mobile-menu-item"
            onClick={closeMobileMenu}
          >
            <FiBookOpen className="menu-item-icon" />
            <span>Courses</span>
          </Link>

          <Link
            to="/pricing"
            className="mobile-menu-item"
            onClick={closeMobileMenu}
          >
            <FiDollarSign className="menu-item-icon" />
            <span>Pricing</span>
          </Link>

          <div className="mobile-divider"></div>

          {user ? (
            <>
              <div className="mobile-user-info">
                <FiUser className="user-icon" />
                <div className="user-details">
                  <span className="user-greeting">Welcome back!</span>
                  <span className="user-name-mobile">{user.fullName || user.name || "User"}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="mobile-menu-button logout"
              >
                <FiLogOut style={{ marginRight: "8px" }} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="mobile-menu-button login"
                onClick={closeMobileMenu}
              >
                <FiLogIn style={{ marginRight: "8px" }} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="mobile-menu-button signup"
                onClick={closeMobileMenu}
              >
                <FiUserPlus style={{ marginRight: "8px" }} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;