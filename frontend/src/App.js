import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductPage,
  BestSellingPage,
  EventsPage,
  FaqPage,
  ProductDetailsPage,
  OrderSuccessPage,
  ProfilePage,
} from "./Routes.js";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { loadUser } from "./redux/actions/user";
import Store from "./redux/store";
import ProtectedRoute from "./ProtectedRoute.js";
import { useSelector } from "react-redux";
function App() {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    Store.dispatch(loadUser());
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route path="/" Component={HomePage} />
        <Route path="/sign-up" Component={SignupPage} />
        <Route
          path="/activation/:activation_token"
          Component={ActivationPage}
        />
        <Route path="/products" Component={ProductPage} />
        <Route path="/product/:name" Component={ProductDetailsPage} />
        <Route path="/best-selling" Component={BestSellingPage} />
        <Route path="/events" Component={EventsPage} />
        <Route path="/faq" Component={FaqPage} />
        <Route path="/order/success/:id" Component={OrderSuccessPage} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />
    </BrowserRouter>
  );
}

export default App;
