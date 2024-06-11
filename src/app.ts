import swagger from "@elysiajs/swagger";
import Elysia from "elysia";

export const app = new Elysia().use(swagger());
