import { executarMotor } from "../engine/engine.js";
import {
  listarResultados,
  limparResultados
} from "../repositories/result.repository.js";

limparResultados();

const dados = {
  produtos: [
    { id: 1, nome: "Notebook", preco: 3000 },
    { id: 2, nome: "Mouse", preco: 100 },
    { id: 3, nome: "Teclado", preco: 200 }
  ],
  estoques: [
    { produto_id: 1, quantidade: 150 },
    { produto_id: 2, quantidade: 10 },
    { produto_id: 3, quantidade: 80 }
  ],
  vendas: [
    { produto_id: 2, quantidade: 40, data: new Date() },
    { produto_id: 3, quantidade: 60, data: new Date() }
  ]
};

const resultados = executarMotor(dados);

console.log("Resultados:");
console.log(JSON.stringify(resultados, null, 2));

console.log("\nArmazenados:");
console.log(JSON.stringify(listarResultados(), null, 2));