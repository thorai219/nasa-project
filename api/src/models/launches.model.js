const axios = require("axios")
const launchesDb = require("./launches.mongo")
const planets = require("./planets.mongo")

const DEFAULT_FLIGHT_NUM = 100

const launch = {
  flightNumber: 100,
  mission: "Kepler exploration",
  rocket: "Explorer IS1",
  launchDate: new Date(),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true
}

const SPACE_X_API = "https://api.spacexdata.com/v4/launches/query"

const populateLaunchs = async () => {
  const response = await axios.post(SPACE_X_API, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1
          }
        },
        {
          path: "payloads",
          select: {
            cusomters: 1
          }
        }
      ]
    }
  })

  if (response.status !== 200) {
    console.log("problem fetching launch data")
    throw new Error("launch data download failed")
  }

  const launchDocs = response.data.docs
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads
    const customers = payloads.flatMap((payload) => {
      return payload.customers
    })
    const luanch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers
    }

    await saveLaunch(luanch)
  }
}

const loadLaunchData = async () => {
  const firstLaunch = await findLaunch({
    flight_number: 1,
    rocket: "Falcon 1",
    mission: "FalconSat"
  })

  if (firstLaunch) {
    console.log("db already populated with spaceX data")
  } else {
    await populateLaunchs()
  }
}

const findLaunch = async (filter) => {
  return await launchesDb.findOne(filter)
}

const existsLaunchWithId = async (launchId) => {
  return await findLaunch({ flightNumber: launchId })
}

const getLastestFlightNumber = async () => {
  const latestLaunch = await launchesDb.findOne().sort("-flightNumber")

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUM
  }

  return latestLaunch.flightNumber
}

const getAllLaunches = async (skip, limit) => {
  return await launchesDb
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit)
}

const saveLaunch = async (launch) => {
  await launchesDb.updateOne(
    {
      flightNumber: launch.flightNumber
    },
    launch,
    { upsert: true }
  )
}

const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOneAndUpdate({ keplerName: launch.target })
  if (!planet) {
    throw new Error("No matching planet was found")
  }
  const newFlightNumber = (await getLastestFlightNumber()) + 1
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber
  })

  await saveLaunch(newLaunch)
}

const abortbyLaunchId = async (launchId) => {
  const aborted = await launchesDb.updateOne(
    {
      flightNumber: launchId
    },
    {
      upcoming: false,
      success: false
    }
  )

  return aborted.modifiedCount === 1 && aborted.matchedCount === 1
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortbyLaunchId
}
