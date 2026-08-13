import { BrowserRouter, Routes, Route } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import Login from "./pages/Login/Login";
import Onboarding from "./pages/Onboarding/Onboarding";
import Result from "./pages/Onboarding/Result";
import Complete from "./pages/Onboarding/Complete";
import RoutineSetting from "./pages/Onboarding/RoutineSetting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/:skinType" element={<Result />} />
          <Route path="/onboarding/complete" element={<Complete />} />
          <Route path="/onboarding/routine-setting" element={<RoutineSetting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;