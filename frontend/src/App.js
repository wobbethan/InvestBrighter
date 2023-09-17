import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import { LoginPage, SignupPage, ActivationPage } from "./Routes.js";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route path="/sign-up" Component={SignupPage} />
        <Route
          path="/activation/:activation_token"
          Component={ActivationPage}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
