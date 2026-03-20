import { useEffect, useState } from "react"
import { api } from "../api/api"

type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
}

export function Products() {

  const [products, setProducts] = useState<Product[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  useEffect(() => {

    async function loadProducts() {

      const token = localStorage.getItem("token")

      const response = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(response.data)

    }

    loadProducts()

  }, [])

  async function handleSave() {

    const token = localStorage.getItem("token")

    if (editingId) {

      await api.put(
        `/products/${editingId}`,
        {
          name,
          category,
          price: Number(price),
          stock: Number(stock)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

    } else {

      await api.post(
        "/products",
        {
          name,
          category,
          price: Number(price),
          stock: Number(stock)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

    }

    setName("")
    setCategory("")
    setPrice("")
    setStock("")
    setEditingId(null)

    const response = await api.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setProducts(response.data)

  }

  function handleEdit(product: Product) {

    setEditingId(product.id)
    setName(product.name)
    setCategory(product.category)
    setPrice(product.price.toString())
    setStock(product.stock.toString())

  }

  async function handleDelete(id: string) {

    const token = localStorage.getItem("token")

    await api.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const response = await api.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setProducts(response.data)

  }

  return (
    <div>

      <h1>Products</h1>

      <h3>{editingId ? "Edit Product" : "Create Product"}</h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button onClick={handleSave}>
          {editingId ? "Update" : "Create"}
        </button>

      </div>

      <table border={1} cellPadding={10}>

        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {products.map(product => (

            <tr key={product.id}>

              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>

              <td>

                <button onClick={() => handleEdit(product)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(product.id)}>
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )

}