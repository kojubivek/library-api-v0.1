import app from "../server";

export async function handler(event, context) {
  return await netlifyLambda(app)(event, context);
}
