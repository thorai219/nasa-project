const path = require("path")
const parse = require("csv-parse")
const fs = require("fs")
const planets = require("./planets.mongo")

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  )
}

const loadPlanetsData = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data", "keplar_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanets(data)
        }
      })
      .on("error", (err) => {
        reject(err)
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length
        console.log(`${countPlanetsFound} habitable planets found!`)
        resolve()
      })
  })
}

const getAllPlanets = async () => {
  return await planets.find({}, { __v: 0, _id: 0 })
}

const savePlanets = async (planet) => {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name
      },
      { keplerName: planet.kepler_name },
      { upsert: true }
    )
  } catch (err) {
    console.error(`Could not save planet ${err}`)
  }
}

module.exports = {
  getAllPlanets,
  loadPlanetsData
}
