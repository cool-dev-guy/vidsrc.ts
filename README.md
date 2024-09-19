## `CUSTOM BRANCH`
# vidsrc.ts - vidsrc-api - vercel
> A cool vidsrc(.me/.net/.xyz/.in/.io) extractor in typescript.(proof of concept) As a vercel API with hono(edge) and ts.

### `HOW TO DEPLOY ? `
- clone repo(branch:`vercel`) [btw leave a star :)]
- import the project in vercel.
- Deploy.

### `GUIDE ?`
- #### _*Movies*_:
  > `
  > https://(deployment)/:TMDBid
  > `
- #### _*Series*_:
  > `
  > https://(deployment)/:TMDBid/:season/:episode
  > `

### `RETURN TYPE`

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
