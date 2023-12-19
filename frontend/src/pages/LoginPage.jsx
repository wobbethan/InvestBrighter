import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Login from "../components/Login/Login.jsx";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Login></Login>
    </div>
  );
}

export default LoginPage;
