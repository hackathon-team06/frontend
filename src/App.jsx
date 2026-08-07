import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home/Home";
import Mission from "./pages/Mission/Mission";
import Product from "./pages/Product/Product";
import Mypage from "./pages/Mypage/Mypage";
import Register from "./pages/Register/Register";
import Onboarding from "./pages/Onboarding/Onboarding";
import Stamp from "./pages/Stamp/Stamp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/product" element={<Product />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/mypage/stamp" element={<Stamp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;