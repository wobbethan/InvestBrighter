import React, { useEffect, useState } from "react";
import AdminSideBar from "./components/Admin/Layout/AdminSideBar";
import AdminHeader from "./components/Layout/AdminHeader";
import { useSearchParams } from "react-router-dom";
import { server } from "../Server";
import axios from "axios";

const AdminChangePassword = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  const id = searchParams.get("id");
  console.log(id);

  //   useEffect(() => {
  //     axios.get(`${server}/user/get-user-info/${id}`).then((res) => {
  //       setEmail(res.data.user.email);
  //       setName(res.data.user.name);
  //     });
  //   }, []);

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <h1>Changing password for {id}</h1>
      </div>
    </div>
  );
};

export default AdminChangePassword;
