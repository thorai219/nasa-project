const launches = new Map()

let latestFlightNumber = 100

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

launches.set(launch.flightNumber, launch)

const existsLaunchWithId = (launchId) => {
  return launches.has(launchId)
}

const getAllLaunches = () => {
  return Array.from(launches.values())
}

const addNewLaunch = (launch) => {
  latestFlightNumber++
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customer: ["Zero to Mastery", "NASA"],
      flightNumber: latestFlightNumber
    })
  )
}

const abortbyLaunchId = (launchId) => {
  const aborted = launches.get(launchId)
  aborted.upcoming = false
  aborted.success = false

  return aborted
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortbyLaunchId
}
