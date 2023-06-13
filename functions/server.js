import app from "../server.js";

export async function handler(event, context) {
  return await netlifyLambda(app)(event, context);
}
