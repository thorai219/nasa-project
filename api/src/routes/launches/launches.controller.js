const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortbyLaunchId
} = require("../../models/launches.model")
const { getPagination } = require("../../services/query")

const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query)
  const launches = await getAllLaunches(skip, limit)
  return res.status(200).json(launches)
}

const httpAddNewLaunch = async (req, res) => {
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

  await scheduleNewLaunch(launch)
  return res.status(201).json(launch)
}

const httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id)

  const exists = await existsLaunchWithId(launchId)

  if (!exists) {
    return res.status(404).json({
      error: "launch not found"
    })
  }

  const aborted = await abortbyLaunchId(launchId)

  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted"
    })
  }
  return res.status(200).json({
    ok: true
  })
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }
