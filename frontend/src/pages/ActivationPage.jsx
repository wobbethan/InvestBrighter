import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { server } from "../Server";
import axios from "axios";
function ActivationPage() {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log(res.data.message);
        } catch (error) {
          console.log(error.response.data.message);
          setError(true);
        }
      };
      activationEmail();
    }
  }, []);

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      {error ? (
        <p>Your token is expired!</p>
      ) : (
        <p>Your account has been created successfully</p>
      )}
    </div>
  );
}

export default ActivationPage;
