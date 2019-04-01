import { createServer, proxy } from "aws-serverless-express";
import { Application } from "./lib/application";

// Express APP
const app = Application.getInstance();

// Create a server running express
const server = createServer(app, undefined, []);

// Passes all requests to the server
module.exports.processRequests = (event: any, context: any) => proxy(server, event, context);
