import express from "express"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  return res.json({
    message: "ZORDON API running 🚀"
  })
})

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
