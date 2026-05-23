import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses";
import { serveStatic } from "hono/bun";
const app = new Hono()
import { authRoute } from "./routes/auth";

app.use("*", logger())

const apiRoutes = app.basePath("/api")
.route("/expenses",expensesRoute)
.route('/',authRoute)

console.log("KINDE_REDIRECT_URI:", process.env.KINDE_REDIRECT_URI);

// Static files (serve frontend or assets)
app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get('*', serveStatic({path:'./frontend/dist/index.html'}))


export default app

export type ApiRoutes = typeof apiRoutes
