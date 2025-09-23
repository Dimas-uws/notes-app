import express from "express"
import { sayHello } from "../handlers/helloHendler.js"

const helloRouter = express.Router()

helloRouter.get("/", sayHello)

export default helloRouter