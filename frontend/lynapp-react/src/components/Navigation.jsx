import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="main-nav">
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <ul className={isOpen ? 'nav-open' : ''}>
        <li><NavLink to="/" className="nav-home" onClick={() => setIsOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/properties" className="nav-properties" onClick={() => setIsOpen(false)}>Properties</NavLink></li>
        <li><NavLink to="/about" className="nav-about" onClick={() => setIsOpen(false)}>About</NavLink></li>

        {currentUser ? (
          <li className="nav-user-dropdown" ref={dropdownRef}>
            <NavLink onClick={() => setIsDropdownOpen(prev => !prev)} className="dropdown-toggle">
              Hello, {currentUser.username} <span className="arrow">▼</span>
            </NavLink>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/dashboard" onClick={() => { setIsOpen(false); setIsDropdownOpen(false); }}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={handleLogout} className="dropdown-item-button">Logout</NavLink>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <>
            <li><NavLink to="/login" className="nav-login" onClick={() => setIsOpen(false)}>Login</NavLink></li>
            <li><NavLink to="/register" className="nav-register" onClick={() => setIsOpen(false)}>Register</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;