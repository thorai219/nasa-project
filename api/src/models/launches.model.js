const launches = new Map()

let latestFlightNumber = 100

const launch = {
  flightNumber: 100,
  mission: "Kepler exploration",
  rocket: "Explorer IS1",
  date: new Date(),
  destination: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true
}

launches.set(launch.flightNumber, launch)

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

module.exports = {
  getAllLaunches,
  addNewLaunch
}
