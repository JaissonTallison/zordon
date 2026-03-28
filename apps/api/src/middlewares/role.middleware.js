export function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    if (!rolesPermitidos.includes(usuario.role)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    next();
  };
}