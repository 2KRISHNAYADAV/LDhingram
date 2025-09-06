import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page for initial experience
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Index;
