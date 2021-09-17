const http = require("http")
const app = require("./app.js")
const { loadPlanetsData } = require("./models/planets.model.js")

const PORT = process.env.PORT || 8080
const server = http.createServer(app)

const startServer = async () => {
  await loadPlanetsData()

  server.listen(PORT, () => console.log(`server started at port ${PORT}`))
}

startServer()
