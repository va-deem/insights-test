import { expect } from "@std/expect";
import { beforeAll, describe, it } from "@std/testing/bdd";
import { createApp } from "./app.ts";
import { withDB } from "./testing.ts";

const BASE_URL = "http://localhost";
const TEST_ENV = {};
const TEST_CTX = {
  passThroughOnException() {},
  waitUntil() {
    return Promise.resolve();
  },
};

describe("createApp", () => {
  describe("health endpoint", () => {
    withDB((fixture) => {
      const app = createApp(fixture);
      let response: Response;

      beforeAll(async () => {
        response = await app.fetch(
          new Request(`${BASE_URL}/_health`),
          TEST_ENV,
          TEST_CTX,
        );
      });

      it("returns 200", () => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe("brands endpoint", () => {
    withDB((fixture) => {
      const app = createApp(fixture);
      let response: Response;
      let body: unknown;

      beforeAll(async () => {
        response = await app.fetch(
          new Request(`${BASE_URL}/brands`),
          TEST_ENV,
          TEST_CTX,
        );
        body = await response.json();
      });

      it("returns 200", () => {
        expect(response.status).toBe(200);
      });

      it("returns seeded brands", () => {
        expect(body).toEqual([
          { id: 1, name: "Brand 1" },
          { id: 2, name: "Brand 2" },
          { id: 3, name: "Brand 3" },
          { id: 4, name: "Brand 4" },
          { id: 5, name: "Brand 5" },
          { id: 6, name: "Brand 6" },
        ]);
      });
    });
  });

  describe("insights routes", () => {
    describe("invalid id param", () => {
      withDB((fixture) => {
        const app = createApp(fixture);
        let response: Response;

        beforeAll(async () => {
          response = await app.fetch(
            new Request(`${BASE_URL}/insights/not-a-number`),
            TEST_ENV,
            TEST_CTX,
          );
        });

        it("returns 400", () => {
          expect(response.status).toBe(400);
        });
      });
    });

    describe("create and delete flow", () => {
      withDB((fixture) => {
        const app = createApp(fixture);
        let createResponse: Response;
        let createdBody: {
          id: number;
          brand: number;
          createdAt: string;
          text: string;
        };
        let deleteResponse: Response;
        let deleteBody: { id: number };

        beforeAll(async () => {
          createResponse = await app.fetch(
            new Request(`${BASE_URL}/insights`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ brand: 1, text: "Created via app test" }),
            }),
            TEST_ENV,
            TEST_CTX,
          );
          createdBody = await createResponse.json();

          deleteResponse = await app.fetch(
            new Request(`${BASE_URL}/insights/${createdBody.id}`, {
              method: "DELETE",
            }),
            TEST_ENV,
            TEST_CTX,
          );
          deleteBody = await deleteResponse.json();
        });

        it("creates an insight with 201", () => {
          expect(createResponse.status).toBe(201);
          expect(createdBody.brand).toBe(1);
          expect(createdBody.text).toBe("Created via app test");
        });

        it("deletes the insight with 200", () => {
          expect(deleteResponse.status).toBe(200);
          expect(deleteBody).toEqual({ id: createdBody.id });
        });
      });
    });
  });
});
