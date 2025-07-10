import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import './styles/LoginPage.css';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}


// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch {
//       setError('Failed to sign in. Please check your credentials.');
//     }
//   };
//
//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <div className="login-card">
//           <h2>Welcome Back</h2>
//           <p>Sign in to your LYN AI account</p>
//
//           {error && <p className="error-message">{error}</p>}
//
//           <form onSubmit={handleSubmit} className="login-form">
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//
//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//
//             <button type="submit" className="login-btn">
//               Sign In
//             </button>
//           </form>
//
//           <div className="login-footer">
//             <p>Don't have an account? <Link to="/register">Sign up</Link></p>
//             <a href="#" className="forgot-password">Forgot password?</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

