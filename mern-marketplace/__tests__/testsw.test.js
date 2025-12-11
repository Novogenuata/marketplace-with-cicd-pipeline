import controller from "../server/controllers/order.controller.js"

describe("Testing the saveTip function", () => {

  let req, res

  beforeEach(() => {
    req = { body: {} }

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  test("should return success with a number entry for the tip", async () => {
    req.body.tip = "15"

    await controller.saveTip(req, res)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      tip: 15
    })
  })

  test("should return 0 if no tip", async () => {
    req.body.tip = undefined

    await controller.saveTip(req, res)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      tip: 0
    })
  })
})
