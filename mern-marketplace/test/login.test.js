// test/login.test.js
import "./setup.js"; // in-memory MongoDB
import User from "../server/models/user.model.js";

describe("User creation (Mongoose only)", () => {
  afterEach(async () => {
    // Clear users after each test
    await User.deleteMany({});
  });

  test("successfully creates a user", async () => {
    // 1. Create the user directly
    const user = await User.create({
      name: "Sam Test",
      email: "samtest@example.com",
      password: "abcdef"
    });

    // 2. Verify user exists in DB
    const found = await User.findOne({ email: "samtest@example.com" });
    expect(found).not.toBeNull();
    expect(found.name).toBe("Sam Test");
  });
});
