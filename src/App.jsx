import { BrowserRouter, Routes, Route } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Onboarding from "./pages/Onboarding/Onboarding";
import Result from "./pages/Onboarding/Result";
import Complete from "./pages/Onboarding/Complete";
import RoutineSetting from "./pages/Onboarding/RoutineSetting";
import Product from "./pages/Product/Product";
import Wishlist from "./pages/Product/Wishlist";
import ProductDetail from "./pages/Product/ProductDetail";
import MissionEdit from "./pages/Home/MissionEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/:skinType" element={<Result />} />
          <Route path="/onboarding/complete" element={<Complete />} />
          <Route
            path="/onboarding/routine-setting"
            element={<RoutineSetting />}
          />
          <Route path="/product" element={<Product />} />
          <Route path="/product/wishlist" element={<Wishlist />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/edit" element={<MissionEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
