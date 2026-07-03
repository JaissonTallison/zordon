import { buscarEmpresa, atualizarEmpresa } from "../repositories/empresa.repository.js";
import { registrarLog } from "../repositories/audit.repository.js";

// obter configurações da empresa
export async function obterEmpresa(req, res) {
  try {
    const empresa_id = req.user.empresa_id;

    const empresa = await buscarEmpresa(empresa_id);

    if (!empresa) {
      return res.status(404).json({ erro: "Empresa não encontrada" });
    }

    return res.json(empresa);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

// configurar empresa (nome, webhook, engine ativo)
export async function configurarEmpresa(req, res) {
  try {
    const empresa_id = req.user.empresa_id;
    const user_id = req.user.id;

    const { nome, webhook_url, engine_ativo } = req.body;

    const empresa = await atualizarEmpresa(empresa_id, {
      nome,
      webhook_url,
      engine_ativo
    });

    await registrarLog({
      user_id,
      empresa_id,
      acao: "UPDATE_EMPRESA",
      descricao: "Configurações da empresa atualizadas"
    });

    return res.json(empresa);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}
