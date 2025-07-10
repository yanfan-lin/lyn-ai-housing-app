import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateInput, validatePasswordMatch } from '../../tools/InputValidation';
import './styles/RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    const usernameError = validateInput(formData.username, 'username');
    const emailError = validateInput(formData.email, 'email');
    const passwordError = validateInput(formData.password, 'password');
    const confirmPasswordError = validatePasswordMatch(formData.password, formData.confirmPassword);

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: passwordError ? null : confirmPasswordError,
      });
      return;
    }

    try {
      setErrors({});
      setLoading(true);
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/login');
    } catch (error) {
      if (error.response?.data?.email) {
        setErrors({ email: 'This email is already registered.' });
      } else if (error.response?.data?.username) {
        setErrors({ username: 'This username is already taken.' });
      } else {
        setErrors({ form: 'Failed to create an account. Please try again.' });
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: null, form: null }));
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h2>Create Account</h2>
          <p>Join LYN AI and start investing smarter</p>

          {errors.form && <p className="error-message">{errors.form}</p>}

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
                className={errors.username ? 'input-error' : ''}
              />
              {errors.username && <p className="error-text">{errors.username}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <button disabled={loading} type="submit" className="register-btn">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="register-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;