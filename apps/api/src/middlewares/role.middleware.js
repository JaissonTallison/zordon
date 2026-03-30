export function autorizar(roleNecessaria) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    if (req.user.role !== roleNecessaria) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    return next();
  };
}