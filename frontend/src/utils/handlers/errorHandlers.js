export function handleError(err) {
  switch (err.type) {
    case "network":
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    case "syntax":
      return "Erro no servidor. Tente novamente mais tarde.";
    default:
      return err.message || "Ocorreu um erro inesperado. Tente novamente.";
  }
}
