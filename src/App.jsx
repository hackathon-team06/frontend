import { BrowserRouter, Routes, Route } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import Main from "./pages/Main/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;