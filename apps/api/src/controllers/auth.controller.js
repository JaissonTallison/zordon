import {
  hashSenha,
  compararSenha,
  gerarToken
} from "../auth/auth.service.js";

import {
  criarUsuario,
  buscarPorEmail,
  criarEmpresa,
  buscarEmpresaPorNome
} from "../repositories/user.repository.js";

import {
  buscarConvite,
  marcarComoUsado
} from "../repositories/invite.repository.js";

//  REGISTRO
export async function registrar(req, res) {
  try {
    const { nome, email, senha, empresa_nome, token } = req.body;

    // verifica se já existe usuário
    const existe = await buscarPorEmail(email);
    if (existe) {
      return res.status(400).json({ erro: "Usuário já existe" });
    }

    const senhaHash = await hashSenha(senha);

    let empresa;

    //  PRIORIDADE 1: cadastro via convite
    if (token) {
      const convite = await buscarConvite(token);

      if (!convite) {
        return res.status(400).json({ erro: "Convite inválido ou já utilizado" });
      }

      empresa = { id: convite.empresa_id };

      // marca convite como usado
      await marcarComoUsado(convite.id);

      const usuario = await criarUsuario({
        nome,
        email,
        senha: senhaHash,
        role: "ANALISTA",
        empresa_id: empresa.id
      });

      return res.json(usuario);
    }

    //  PRIORIDADE 2: criação normal (ADMIN cria empresa)
    if (!empresa_nome) {
      return res.status(400).json({ erro: "empresa_nome é obrigatório" });
    }

    // busca empresa existente
    empresa = await buscarEmpresaPorNome(empresa_nome);

    // se não existir, cria
    if (!empresa) {
      empresa = await criarEmpresa(empresa_nome);
    }

    const usuario = await criarUsuario({
      nome,
      email,
      senha: senhaHash,
      role: "ADMIN",
      empresa_id: empresa.id
    });

    return res.json(usuario);

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

//  LOGIN
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

    return res.json({ token });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}