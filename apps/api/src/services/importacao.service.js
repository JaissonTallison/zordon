import * as XLSX from "xlsx";
import {
  findProdutoByNome,
  createProduto,
  updateProduto
} from "../repositories/produto.repository.js";
import vendaRepository from "../repositories/venda.repository.js";

/**
 * Lê o arquivo enviado (.xlsx, .xls, .csv ou .txt) e devolve uma lista de
 * linhas normalizadas em objetos { produto, quantidade, valor, estoque }.
 *
 * Formato esperado (colunas por nome, case-insensitive):
 *   produto | quantidade | valor | estoque (opcional)
 */
function parseArquivo(buffer, nomeArquivo) {
  const ext = nomeArquivo.split(".").pop().toLowerCase();

  let linhas = [];

  if (ext === "txt") {
    const texto = buffer.toString("utf-8").trim();
    const sep = texto.includes("\t") ? "\t" : ",";
    const [cabecalho, ...resto] = texto.split(/\r?\n/).filter(Boolean);
    const colunas = cabecalho.split(sep).map((c) => c.trim().toLowerCase());

    linhas = resto.map((linha) => {
      const valores = linha.split(sep);
      const obj = {};
      colunas.forEach((col, i) => { obj[col] = (valores[i] || "").trim(); });
      return obj;
    });
  } else {
    // xlsx, xls, csv
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const primeiraAba = workbook.SheetNames[0];
    const sheet = workbook.Sheets[primeiraAba];
    const bruto = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    linhas = bruto.map((row) => {
      const obj = {};
      Object.keys(row).forEach((chave) => {
        obj[chave.trim().toLowerCase()] = row[chave];
      });
      return obj;
    });
  }

  return linhas;
}

function numero(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export async function importarRelatorio({ buffer, nomeArquivo, empresaId }) {
  if (!empresaId) throw new Error("empresaId é obrigatório");

  const linhas = parseArquivo(buffer, nomeArquivo);

  const resumo = {
    linhas_lidas: linhas.length,
    vendas_inseridas: 0,
    produtos_criados: 0,
    produtos_atualizados: 0,
    erros: [],
  };

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    const numeroLinha = i + 2; // +1 cabeçalho, +1 base 1

    try {
      const nomeProduto = String(linha.produto || linha.nome || "").trim();
      const quantidade = numero(linha.quantidade || linha.qtd);
      const valor = numero(linha.valor || linha.total || linha.preco);
      const estoque = numero(linha.estoque);

      if (!nomeProduto) {
        resumo.erros.push({ linha: numeroLinha, motivo: "coluna 'produto' vazia ou ausente" });
        continue;
      }

      let produto = await findProdutoByNome(nomeProduto, empresaId);

      if (!produto) {
        produto = await createProduto(
          { nome: nomeProduto, estoque: estoque ?? 0, minimo: 5, valor: valor ?? 0 },
          empresaId
        );
        resumo.produtos_criados++;
      } else if (estoque !== null && estoque !== produto.estoque) {
        await updateProduto(produto.id, { estoque }, empresaId);
        resumo.produtos_atualizados++;
      }

      if (quantidade !== null && valor !== null) {
        await vendaRepository.createVenda(
          { produto_id: produto.id, quantidade, valor },
          empresaId
        );
        resumo.vendas_inseridas++;
      }
    } catch (err) {
      resumo.erros.push({ linha: numeroLinha, motivo: err.message });
    }
  }

  return resumo;
}
