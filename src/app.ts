import jwt from "@elysiajs/jwt";
import swagger from "@elysiajs/swagger";
import { User } from "@prisma/client";
import Elysia, { t } from "elysia";
import { prisma } from "./prisma";

export const app = new Elysia().use(swagger()).use(
  jwt({
    secret: "Secret Key",
  })
);

app.group("/auth", (router) =>
  router.post(
    "/signUp",
    async ({ body, jwt, cookie: { auth } }) => {
      const existingUser = await prisma.user.findFirst({
        where: { username: body.username },
      });

      if (existingUser) {
        return new Response("User already exists", { status: 400 });
      }

      const passwordHash = await Bun.password.hash(body.password);

      await prisma.user.create({
        data: { ...body, password: passwordHash },
      });

      auth.set({
        value: jwt.sign({ username: body.username }),
      });

      return "Signed up successfully";
    },
    {
      body: t.Object({
        firstName: t.String({ minLength: 1 }),
        lastName: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1 }),
        username: t.String({ minLength: 1 }),
      }),
    }
  )
);
