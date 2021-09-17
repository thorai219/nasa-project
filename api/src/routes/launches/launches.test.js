const request = require("supertest")
const app = require("../../app")

describe("TEST GET /launches", () => {
  test("it should response with 200", async () => {
    const response = await request(app).get("/launches").expect("Content-Type", /json/).expect(200)
  })
})

describe("TEST POST /launch", () => {
  const completeLaunchData = {
    mission: "USS enterprise",
    rocket: "NCC 1701-D",
    target: "Kepler-186 F",
    launchDate: "January 14, 2029"
  }

  const launchDataWithoutDate = {
    mission: "USS enterprise",
    rocket: "NCC 1701-D",
    target: "Kepler-186 F"
  }

  const launchDataWithInvalidDate = {
    mission: "USS enterprise",
    rocket: "NCC 1701-D",
    target: "Kepler-186 F",
    launchDate: "Horse"
  }

  test("it should respond with 201", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201)

    const requestDate = new Date(completeLaunchData.launchDate).valueOf()
    const responseDate = new Date(response.body.launchDate).valueOf()
    expect(responseDate).toBe(requestDate)
    expect(response.body).toMatchObject(launchDataWithoutDate)
  })

  test("catch missing fields", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400)

    expect(response.body).toStrictEqual({
      error: "missing required fields"
    })
  })

  test("catch invalid date", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400)

    expect(response.body).toStrictEqual({
      error: "invalid launch date"
    })
  })

  test("catch invalid id for launch", async () => {
    const response = await request(app)
      .delete(`/launches/300`)
      .expect("Content-Type", /json/)
      .expect(404)

    expect(response.body).toStrictEqual({
      error: "launch not found"
    })
  })

  test("can abort a launch mission", async () => {
    const response = await request(app)
      .del(`/launches/100`)
      .expect("Content-Type", /json/)
      .expect(200)
  })
})
