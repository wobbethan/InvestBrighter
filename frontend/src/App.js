import {Route, Routes, BrowserRouter} from "react-router-dom"
import './App.css';
import {LoginPage} from "./Routes.js"
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" Component={LoginPage}/>
        
    </Routes>
    </BrowserRouter>
  );
}

export default App;
