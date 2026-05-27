import {
  listarRegras,
  buscarRegra,
  criarRegra,
  atualizarRegra,
  toggleRegra,
  deletarRegra,
} from "../repositories/regras.repository.js";

// GET /api/regras
export async function listar(req, res) {
  try {
    const empresaId = req.user.empresa_id;
    const apenasAtivas = req.query.ativas === "true";
    const regras = await listarRegras(empresaId, { apenasAtivas });
    res.json(regras);
  } catch (err) {
    console.error("[regras] listar:", err);
    res.status(500).json({ erro: "Erro ao listar regras" });
  }
}

// GET /api/regras/:id
export async function buscar(req, res) {
  try {
    const regra = await buscarRegra(req.params.id, req.user.empresa_id);
    if (!regra) return res.status(404).json({ erro: "Regra não encontrada" });
    res.json(regra);
  } catch (err) {
    console.error("[regras] buscar:", err);
    res.status(500).json({ erro: "Erro ao buscar regra" });
  }
}

// POST /api/regras
export async function criar(req, res) {
  try {
    const { nome, codigo, tipo, condicoes } = req.body;
    if (!nome || !codigo || !tipo || !condicoes) {
      return res.status(400).json({ erro: "nome, codigo, tipo e condicoes são obrigatórios" });
    }
    const regra = await criarRegra(req.user.empresa_id, req.body);
    res.status(201).json(regra);
  } catch (err) {
    console.error("[regras] criar:", err);
    res.status(500).json({ erro: "Erro ao criar regra" });
  }
}

// PUT /api/regras/:id
export async function atualizar(req, res) {
  try {
    const regra = await atualizarRegra(req.params.id, req.user.empresa_id, req.body);
    if (!regra) return res.status(404).json({ erro: "Regra não encontrada" });
    res.json(regra);
  } catch (err) {
    console.error("[regras] atualizar:", err);
    res.status(500).json({ erro: "Erro ao atualizar regra" });
  }
}

// PATCH /api/regras/:id/toggle
export async function toggle(req, res) {
  try {
    const regra = await toggleRegra(req.params.id, req.user.empresa_id);
    if (!regra) return res.status(404).json({ erro: "Regra não encontrada" });
    res.json(regra);
  } catch (err) {
    console.error("[regras] toggle:", err);
    res.status(500).json({ erro: "Erro ao alterar estado da regra" });
  }
}

// DELETE /api/regras/:id
export async function deletar(req, res) {
  try {
    const ok = await deletarRegra(req.params.id, req.user.empresa_id);
    if (!ok) return res.status(404).json({ erro: "Regra não encontrada" });
    res.json({ mensagem: "Regra removida com sucesso" });
  } catch (err) {
    console.error("[regras] deletar:", err);
    res.status(500).json({ erro: "Erro ao deletar regra" });
  }
}
