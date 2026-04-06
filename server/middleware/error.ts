import type * as oak from "@oak/oak";
import { HttpError } from "../errors.ts";

export const errorMiddleware: oak.Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.status >= 500) {
        console.error("Server error: ", error.cause ?? error);
      }

      ctx.response.status = error.status;
      ctx.response.body = error.body;
      return;
    }

    console.error("Server error: ", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};
