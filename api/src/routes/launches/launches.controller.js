const { getAllLaunches, addNewLaunch } = require("../../models/launches.model")

const httpGetAllLaunches = (req, res) => {
  return res.status(200).json(getAllLaunches())
}

const httpAddNewLaunch = (req, res) => {
  const { launch } = req.body

  launch.date = new Date(launch.date)

  addNewLaunch(launch)
  return res.status(201).json(launch)
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch }
