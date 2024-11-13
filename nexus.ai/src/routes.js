import {
  BrowserRouter,
  Navigate,
  useNavigate,
  Route,
  Routes,
} from "react-router-dom";
import React, { useEffect } from "react";
import { useContextSelector } from "use-context-selector";
import { AppContext } from "./contexts/AppContext";

const PaginaPrincipal = React.lazy(() => import("./pages/paginaPrincipal"));

function AppRoutes() {
  const signed = useContextSelector(AppContext, (context) => context.signed);
  const navigate = useNavigate();

  useEffect(() => {
    if (signed) {
      navigate("/");
    }
  }, [signed]);

  return (
    <Routes>
      <Route path="/login" element={<h1>Tela de Login</h1>} />

      <Route
        path="/"
        element={signed ? <PaginaPrincipal /> : <Navigate to="/login" />} // Verifica se está autenticado antes de acessar
      />
      <Route
        path="/teste"
        element={signed ? <PaginaPrincipal /> : <Navigate to="/login" />} // Verifica também para a rota /teste
      />

      {/* Rota padrão para redirecionar caso a rota não exista */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;
