import type * as oak from "@oak/oak";

export const notFoundMiddleware: oak.Middleware = (ctx) => {
  ctx.response.status = 404;
  ctx.response.body = { error: "Not found" };
};
