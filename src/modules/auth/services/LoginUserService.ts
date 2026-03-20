import { pool } from "../../../database/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SECRET = "zordon_secret"

export class LoginUserService {

  async execute({ email, password }: any) {

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    )

    const user = result.rows[0]

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new Error("Invalid credentials")
    }

    const token = jwt.sign(
      { userId: user.id },
      SECRET,
      { expiresIn: "1d" }
    )

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    }

  }

}