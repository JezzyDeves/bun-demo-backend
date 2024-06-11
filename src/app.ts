import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { prisma } from "./prisma";

export const app = new Elysia().use(swagger());

app.group("/users", (router) =>
  router.get("/", async () => await prisma.user.findMany())
);
