import { pool } from "../../../database/db"

interface UpdateProductDTO {
  id: string
  name: string
  category: string
  price: number
  stock: number
}

export class UpdateProductService {

  async execute({ id, name, category, price, stock }: UpdateProductDTO) {

    const result = await pool.query(
      `
      UPDATE products
      SET name = $1,
          category = $2,
          price = $3,
          stock = $4
      WHERE id = $5
      RETURNING *
      `,
      [name, category, price, stock, id]
    )

    return result.rows[0]

  }

}