import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<h1>Tela de Login</h1>} />
        <Route path="/" element={<Navigate to="/" />} />
        <Route path="*" element={<h1>Não Encontrado</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
