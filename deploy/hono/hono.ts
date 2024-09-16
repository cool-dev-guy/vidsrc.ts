```
Deploy this code to use it with hono(with deno)
```
import tmdbScrape from "https://raw.githubusercontent.com/cool-dev-guy/vidsrc.ts/main/vidsrc.ts";
import { Hono } from "npm:hono";
const app = new Hono();
app.get("/api/:id/:ss?/:ep?", async (c) => {
  const { id, ss, ep } = c.req.param();
  const results = (!ss && !ep) ? await tmdbScrape(id, "movie") : await tmdbScrape(id, "tv", Number(ss), Number(ep));
  return c.json(results);
});
export default app.fetch;
