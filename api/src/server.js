const http = require("http")
const app = require("./app.js")
require("dotenv").config()
const { mongoConnect } = require("./services/mongo")
const { loadPlanetsData } = require("./models/planets.model.js")
const { loadLaunchData } = require("./models/launches.model")

const PORT = process.env.PORT || 8080

const server = http.createServer(app)

const startServer = async () => {
  await mongoConnect()
  await loadPlanetsData()
  await loadLaunchData()

  server.listen(PORT, () => console.log(`server started at port ${PORT}`))
}

startServer()
