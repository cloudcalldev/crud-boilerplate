import * as chai from "chai";
import * as HttpStatusCodes from "http-status-codes";
import { Configuration } from "../lib";
import { testApplication as app } from "../testrunner";
import chaiHttp = require("chai-http");

const sampleJwt = "";

describe("Utility API routes", () => {

  beforeAll(() => {
    return Configuration.getCredentials().catch(error => console.error("Could not load configuration so can not start the application", error));
  });

  function fetch(request: string, data?: any, jwt?: string) {
    const jwtToken = jwt || sampleJwt;
    return chai.request(app).post(request)
      .set("Authorization", `Bearer ${jwtToken}`)
      .set("x-consumer-id", "1")
      .set("x-consumer-custom-id", "1")
      .set("x-consumer-username", "1")
      .send(data);
  }

  describe("GET /", () => {
    test("Can get service by a single ID", (done) => {
      fetch("/")
        .end()
    });
  });

  describe("GET /teapot", () => {

    test("should return 418 `I'm a teapot`", (done) => {
      app.get("/teapot")
        .expect(HttpStatusCodes.IM_A_TEAPOT)
        .expect("content-type", /json/)
        .expect({ error: { message: "I'm a teapot" } })
        .end(done);
    });

    test("should not return the `x-powered-by` header", (done) => {
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

    test("should return 500 `Internal Server Error`", (done) => {
      app.get("/error")
        .expect(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .expect("content-type", /json/)
        .expect({ message: "Internal Server Error" })
        .end(done);
    });
  });
});
