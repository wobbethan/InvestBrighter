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
} from "./Routes.js";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { loadUser } from "./redux/actions/user";
import Store from "./redux/store";

function App() {
  useEffect(() => {
    Store.dispatch(loadUser);
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
        <Route path="/best-selling" Component={BestSellingPage} />
        <Route path="/events" Component={EventsPage} />
        <Route path="/faq" Component={FaqPage} />
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
