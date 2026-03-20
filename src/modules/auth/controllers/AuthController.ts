import { Request, Response } from "express"
import { RegisterUserService } from "../services/RegisterUserService"
import { LoginUserService } from "../services/LoginUserService"

export class AuthController {

  async register(req: Request, res: Response) {

    const service = new RegisterUserService()

    const user = await service.execute(req.body)

    return res.json(user)

  }

  async login(req: Request, res: Response) {

    const service = new LoginUserService()

    const result = await service.execute(req.body)

    return res.json(result)

  }

}