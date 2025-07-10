import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/auth/login', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return null;
  }

  return currentUser ? children : null;
}