# vidsrc.ts
A cool vidsrc(.me/.net/.xyz/.in/.io) extractor in typescript.(proof of concept)

### QUICK
- *API (vercel)* :

  [https://github.com/cool-dev-guy/vidsrc.ts/tree/vercel](https://github.com/cool-dev-guy/vidsrc.ts/tree/vercel)

  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cool-dev-guy/vidsrc.ts/tree/vercel)
- MODULE (node/deno) :

  [https://github.com/cool-dev-guy/vidsrc.ts/tree/main](https://github.com/cool-dev-guy/vidsrc.ts/tree/main)
  
### FEATURES
- Nodejs & deno compatible (Deno : `deno run --allow-net vidsrc.ts`)
- Function (`tmdbScrape`) importable in any server libs (axios/hono/cf-workers)
- Deployable everywhere.

### USAGE (INPUT)
```ts
import tmdbScrape from "vidsrc.ts"; 
console.log(await tmdbScrape("76479", "tv",1,1));

await tmdbScrape("TMDB_ID", "movie"); // movies (TMDB_ID:string,"movie")
await tmdbScrape("TMDB_ID","tv",1,1); // series (TMDB_ID:string,"tv",season:number,episode:number)
```

### RETURN TYPE

** supposed to change later.

```js
[
  {
    name: "",
    image: "",
    mediaId: "996",
    stream: "https://playlist.m3u8",
  }
]
```
