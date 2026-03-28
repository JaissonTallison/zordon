import {
  hashSenha,
  compararSenha,
  gerarToken
} from "../auth/auth.service.js";

import {
  criarUsuario,
  buscarPorEmail
} from "../repositories/user.repository.js";

export async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const existe = await buscarPorEmail(email);
    if (existe) {
      return res.status(400).json({ erro: "Usuário já existe" });
    }

    const senhaHash = await hashSenha(senha);

    const usuario = await criarUsuario({
      nome,
      email,
      senha: senhaHash,
      role: "ANALISTA"
    });

    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await buscarPorEmail(email);
    if (!usuario) {
      return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await compararSenha(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    const token = gerarToken(usuario);

    return res.json({
      token
    });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}