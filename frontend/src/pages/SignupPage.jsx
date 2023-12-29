import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "../components/Signup/Signup.jsx";
function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Signup></Signup>
    </div>
  );
}

export default SignupPage;
