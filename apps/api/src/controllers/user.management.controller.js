import {
  listarUsuarios,
  atualizarRole,
  removerUsuario
} from "../repositories/user.management.repository.js";

import { registrarLog } from "../repositories/audit.repository.js";

//  listar usuários
export async function listar(req, res) {
  try {
    const empresa_id = req.usuario.empresa_id;

    const usuarios = await listarUsuarios(empresa_id);

    return res.json(usuarios);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

//  atualizar role
export async function alterarRole(req, res) {
  try {
    const empresa_id = req.usuario.empresa_id;
    const user_id = req.usuario.id;

    const { userId, role } = req.body;

    const usuario = await atualizarRole(userId, role, empresa_id);

    await registrarLog({
      user_id,
      empresa_id,
      acao: "UPDATE_ROLE",
      descricao: `Usuário ${userId} alterado para ${role}`
    });

    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

//  remover usuário
export async function remover(req, res) {
  try {
    const empresa_id = req.usuario.empresa_id;
    const user_id = req.usuario.id;

    const { userId } = req.body;

    if (user_id === userId) {
      return res.status(400).json({ erro: "Não pode remover a si mesmo" });
    }

    await removerUsuario(userId, empresa_id);

    await registrarLog({
      user_id,
      empresa_id,
      acao: "DELETE_USER",
      descricao: `Usuário ${userId} removido`
    });

    return res.json({ sucesso: true });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}