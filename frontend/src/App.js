import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import { LoginPage, SignupPage } from "./Routes.js";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route path="/sign-up" Component={SignupPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
