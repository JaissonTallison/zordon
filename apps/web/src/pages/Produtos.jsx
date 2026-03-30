import { useEffect, useState } from "react";
import api from "../services/api";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    preco: "",
    estoque: ""
  });

  async function carregarProdutos() {
    try {
      const res = await api.get("/produtos");
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // =========================
  // FILTRO
  // =========================
  const produtosFiltrados = produtos.filter((p) => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());

    if (filtro === "baixo") return p.estoque < 10 && matchBusca;
    if (filtro === "sem") return p.estoque === 0 && matchBusca;

    return matchBusca;
  });

  // =========================
  // ABRIR MODAL
  // =========================
  function abrirCriar() {
    setEditando(null);
    setForm({ nome: "", preco: "", estoque: "" });
    setModalOpen(true);
  }

  function abrirEditar(produto) {
    setEditando(produto);
    setForm(produto);
    setModalOpen(true);
  }

  // =========================
  // SALVAR
  // =========================
  async function salvar() {
    try {
      if (editando) {
        await api.put(`/produtos/${editando.id}`, form);
      } else {
        await api.post("/produtos", form);
      }

      setModalOpen(false);
      carregarProdutos();
    } catch (err) {
      console.error("Erro ao salvar", err);
    }
  }

  // =========================
  // EXCLUIR
  // =========================
  async function excluir(id) {
    if (!confirm("Deseja remover este produto?")) return;

    try {
      await api.delete(`/produtos/${id}`);
      carregarProdutos();
    } catch (err) {
      console.error("Erro ao excluir", err);
    }
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-gray-500">Gerencie seus produtos</p>
        </div>

        <button
          onClick={abrirCriar}
          className="bg-zordon-accent text-white px-4 py-2 rounded-lg"
        >
          + Novo Produto
        </button>
      </div>

      {/* BUSCA */}
      <div className="flex gap-3">
        <input
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="todos">Todos</option>
          <option value="baixo">Estoque baixo</option>
          <option value="sem">Sem estoque</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {produtosFiltrados.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-xl shadow">

            <h2 className="font-semibold text-lg">{p.nome}</h2>

            <p className="text-sm text-gray-500">
              Estoque: {p.estoque}
            </p>

            <span className={`text-xs px-2 py-1 rounded-full ${
              p.estoque === 0
                ? "bg-red-100 text-red-600"
                : p.estoque < 10
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-600"
            }`}>
              {p.estoque === 0
                ? "Sem estoque"
                : p.estoque < 10
                ? "Baixo"
                : "OK"}
            </span>

            <p className="text-xl font-bold mt-3">
              R$ {p.preco}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => abrirEditar(p)}
                className="flex-1 bg-gray-100 py-2 rounded-lg"
              >
                Editar
              </button>

              <button
                onClick={() => excluir(p.id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                Excluir
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <h2 className="text-lg font-bold">
              {editando ? "Editar Produto" : "Novo Produto"}
            </h2>

            <input
              placeholder="Nome"
              value={form.nome}
              onChange={(e) =>
                setForm({ ...form, nome: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              placeholder="Preço"
              value={form.preco}
              onChange={(e) =>
                setForm({ ...form, preco: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              placeholder="Estoque"
              value={form.estoque}
              onChange={(e) =>
                setForm({ ...form, estoque: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />

            <div className="flex gap-2">
              <button
                onClick={salvar}
                className="flex-1 bg-zordon-accent text-white py-2 rounded-lg"
              >
                Salvar
              </button>

              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}