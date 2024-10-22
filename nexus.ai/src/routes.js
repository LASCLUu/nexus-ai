import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./pages/main";
import Teste from "./pages/teste";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<h1>Tela de Login</h1>} />
        <Route path="/" element={<Main />} />
        <Route path="/teste" element={<Teste />} />
        <Route path="*" element={<Navigate to="/teste" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
