// Silence logger
process.env.LOG_LEVEL = "fatal";

import "reflect-metadata";
import * as supertest from "supertest";
import { Application } from "./lib/application";

// Application instance wrapped in SuperTest utilities
export const testApplication: supertest.SuperTest<supertest.Test> = supertest(Application.getInstance()) as supertest.SuperTest<supertest.Test>;
