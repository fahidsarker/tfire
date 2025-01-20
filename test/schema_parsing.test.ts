import { z } from "zod";
import { array, boolean, number, object, string } from "../src/schema/elements";
describe("Schema parsing tests", () => {
  it("should parse a string schema", () => {
    const userSchema = object({
      name: string(),
      age: number(),
      isWhite: boolean(),
      marks: array(number()),
    });

    const v = userSchema.build().parse({
      name: "test",
      age: 20,
      isWhite: true,
      marks: [0, 2, 3],
    });

    expect(v).toEqual({
      name: "test",
      age: 20,
      isWhite: true,
      marks: [0, 2, 3],
    });
  });
});
