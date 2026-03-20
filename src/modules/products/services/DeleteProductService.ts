import { pool } from "../../../database/db"

export class DeleteProductService {

  async execute(id: string) {

    await pool.query(
      `DELETE FROM products WHERE id = $1`,
      [id]
    )

  }

}