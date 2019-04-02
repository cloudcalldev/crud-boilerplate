import * as HttpStatusCodes from "http-status-codes";
import { join } from "path";
import { testApplication as app } from "../testrunner";

describe("Utility API routes", () => {

    describe("GET /", () => {

        it("should return service metadata", (done) => {
            const metadata = require(join("..", "..", "package.json"));
            app.get("/")
                .expect(HttpStatusCodes.OK)
                .expect("content-type", /json/)
                .expect({
                    data: {
                        author: metadata.author,
                        description: metadata.description,
                        name: metadata.name,
                        version: metadata.version,
                    },
                })
                .end(done);
        });
    });

    describe("GET /teapot", () => {

        it("should return 418 `I'm a teapot`", (done) => {
            app.get("/teapot")
                .expect(HttpStatusCodes.IM_A_TEAPOT)
                .expect("content-type", /json/)
                .expect({ error: { message: "I'm a teapot" } })
                .end(done);
        });

        it("should not return the `x-powered-by` header", (done) => {
            app.get("/teapot")
                .expect(HttpStatusCodes.IM_A_TEAPOT)
                .expect("content-type", /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    expect(res.header).not.toHaveProperty("x-powered-by");
                    done();
                });
        });
    });

    describe("GET /error", () => {

        it("should return 500 `Internal Server Error`", (done) => {
            app.get("/error")
                .expect(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .expect("content-type", /json/)
                .expect({ message: "Internal Server Error" })
                .end(done);
        });
    });
});
