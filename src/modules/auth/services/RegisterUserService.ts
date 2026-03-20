import { pool } from "../../../database/db"
import bcrypt from "bcrypt"

export class RegisterUserService {

  async execute({ name, email, password }: any) {

    const userExists = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    )

    if (userExists.rows.length > 0) {
      throw new Error("User already exists")
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1,$2,$3)
      RETURNING id,name,email
      `,
      [name, email, passwordHash]
    )

    return result.rows[0]

  }

}