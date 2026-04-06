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
  describe("unmatched route", () => {
    withDB((fixture) => {
      const app = createApp(fixture);
      let response: Response;
      let body: unknown;

      beforeAll(async () => {
        response = await app.fetch(
          new Request(`${BASE_URL}/missing`),
          TEST_ENV,
          TEST_CTX,
        );
        body = await response.json();
      });

      it("returns 404", () => {
        expect(response.status).toBe(404);
      });

      it("returns not found error", () => {
        expect(body).toEqual({ error: "Not found" });
      });
    });
  });

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

    describe("lookup missing insight", () => {
      withDB((fixture) => {
        const app = createApp(fixture);
        let response: Response;
        let body: unknown;

        beforeAll(async () => {
          response = await app.fetch(
            new Request(`${BASE_URL}/insights/999`),
            TEST_ENV,
            TEST_CTX,
          );
          body = await response.json();
        });

        it("returns 404", () => {
          expect(response.status).toBe(404);
        });

        it("returns not found error", () => {
          expect(body).toEqual({ error: "Not found" });
        });
      });
    });

    describe("create with invalid JSON", () => {
      withDB((fixture) => {
        const app = createApp(fixture);
        let response: Response;
        let body: unknown;

        beforeAll(async () => {
          response = await app.fetch(
            new Request(`${BASE_URL}/insights`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: "{invalid-json",
            }),
            TEST_ENV,
            TEST_CTX,
          );
          body = await response.json();
        });

        it("returns 400", () => {
          expect(response.status).toBe(400);
        });

        it("returns invalid JSON error", () => {
          expect(body).toEqual({ error: "Invalid JSON" });
        });
      });
    });

    describe("create with invalid payload", () => {
      withDB((fixture) => {
        const app = createApp(fixture);
        let response: Response;
        let body: unknown;

        beforeAll(async () => {
          response = await app.fetch(
            new Request(`${BASE_URL}/insights`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ brand: 1, text: "" }),
            }),
            TEST_ENV,
            TEST_CTX,
          );
          body = await response.json();
        });

        it("returns 400", () => {
          expect(response.status).toBe(400);
        });

        it("returns validation issues", () => {
          expect(body).toMatchObject({
            error: [
              {
                path: ["text"],
              },
            ],
          });
        });
      });
    });

    describe("create with unknown brand", () => {
      withDB((fixture) => {
        const app = createApp(fixture);
        let response: Response;
        let body: unknown;

        beforeAll(async () => {
          response = await app.fetch(
            new Request(`${BASE_URL}/insights`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ brand: 999, text: "Unknown brand" }),
            }),
            TEST_ENV,
            TEST_CTX,
          );
          body = await response.json();
        });

        it("returns 500", () => {
          expect(response.status).toBe(500);
        });

        it("returns create error", () => {
          expect(body).toEqual({ error: "Failed to create insight" });
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

    describe("update flow", () => {
      withDB((fixture) => {
        const app = createApp(fixture);
        let createResponse: Response;
        let updateResponse: Response;
        let createdBody: {
          id: number;
          brand: number;
          createdAt: string;
          text: string;
        };
        let updatedBody: {
          id: number;
          brand: number;
          createdAt: string;
          text: string;
        };

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

          updateResponse = await app.fetch(
            new Request(`${BASE_URL}/insights/${createdBody.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ brand: 2, text: "Updated via app test" }),
            }),
            TEST_ENV,
            TEST_CTX,
          );
          updatedBody = await updateResponse.json();
        });

        it("updates an insight with 200", () => {
          expect(updateResponse.status).toBe(200);
          expect(updatedBody.id).toBe(createdBody.id);
          expect(updatedBody.brand).toBe(2);
          expect(updatedBody.text).toBe("Updated via app test");
        });
      });
    });

    describe("delete missing insight", () => {
      withDB((fixture) => {
        const app = createApp(fixture);
        let response: Response;
        let body: unknown;

        beforeAll(async () => {
          response = await app.fetch(
            new Request(`${BASE_URL}/insights/999`, {
              method: "DELETE",
            }),
            TEST_ENV,
            TEST_CTX,
          );
          body = await response.json();
        });

        it("returns 404", () => {
          expect(response.status).toBe(404);
        });

        it("returns not found error", () => {
          expect(body).toEqual({ error: "Not found" });
        });
      });
    });
  });
});
