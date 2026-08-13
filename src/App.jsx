import { BrowserRouter, Routes, Route } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
