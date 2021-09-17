const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortbyLaunchId
} = require("../../models/launches.model")

const httpGetAllLaunches = (req, res) => {
  return res.status(200).json(getAllLaunches())
}

const httpAddNewLaunch = (req, res) => {
  const launch = req.body

  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({
      error: "missing required fields"
    })
  }

  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "invalid launch date"
    })
  }

  addNewLaunch(launch)
  return res.status(201).json(launch)
}

const httpAbortLaunch = (req, res) => {
  const launchId = Number(req.params.id)

  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "launch not found"
    })
  }

  const aborted = abortbyLaunchId(launchId)
  return res.status(200).json(aborted)
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }
