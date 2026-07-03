import { importarRelatorio } from "../services/importacao.service.js";

export async function importarRelatorioController(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({ error: "empresa_id não encontrado no token" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const resumo = await importarRelatorio({
      buffer: req.file.buffer,
      nomeArquivo: req.file.originalname,
      empresaId,
    });

    return res.json(resumo);
  } catch (err) {
    console.error("Erro ao importar relatório:", err);
    return res.status(500).json({ error: "Erro ao importar relatório: " + err.message });
  }
}
