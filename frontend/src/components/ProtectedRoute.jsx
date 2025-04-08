import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../contexts/AppContext";

function ProtectedRoute({ children, anonymous = false }) {
  const location = useLocation();
  const from = location.state?.from || { pathname: "/" };

  const { isLoggedIn } = useContext(AppContext);

  // Se o usuário estiver logado, vamos redirecioná-lo para longe das rotas anônimas.
  if (anonymous && isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  // Se o usuário não estiver logado e tentar acessar uma rota que requer autorização, vamos redirecioná-lo para a página de login.
  if (!anonymous && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Caso contrário, renderize o componente filho da rota protegida.
  return children;
}

export default ProtectedRoute;
