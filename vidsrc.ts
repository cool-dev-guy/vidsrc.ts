/*
written by @cool-dev-guy
github: https://github.com/cool-dev-guy
*/

/*
NOTES:
import cheerio from "cheerio"; // FOR NODE.JS
import cheerio from "npm:cheerio"; // FOR DENO
*/
import cheerio from "cheerio";
import { decrypt } from "./helpers/decoder.ts";

const BASEDOM = "https://whisperingauroras.com";

interface Servers {
  name: string | null;
  dataHash: string | null;
}
interface APIResponse {
  name: string | null;
  image: string | null;
  mediaId: string | null;
  stream: string | null;
}
interface RCPResponse {
  metadata: {
    title: string;
    image: string;
  };
  data: string;
}
async function serversLoad(html): Promise<Servers[]> {
  const $ = cheerio.load(html);
  const servers: Servers[] = [];
  $(".serversList .server").each((index, element) => {
    const server = $(element);
    servers.push({
      name: server.text().trim(),
      dataHash: server.attr("data-hash"),
    });
  });
  return servers;
}
async function SRCRCPhandler() {
}
async function PRORCPhandler(prorcp: string): Promise<string | null> {
  const prorcpFetch = await fetch(`${BASEDOM}/prorcp/${prorcp}`);
  const prorcpResponse = await prorcpFetch.text();
  const jsFile =
    prorcpResponse.match(/<script\s+src="\/([^"]*\.js)\?\_=([^"]*)"><\/script>/gm)?.reduce((_, match) =>
      match.replace(/.*src="\/([^"]*\.js)\?\_=([^"]*)".*/, "$1?_=$2")
    ) || "";
  const jsFileReq = await fetch(
    `${BASEDOM}/${jsFile}`,
    {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "priority": "u=1",
        "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "script",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "same-origin",
        "Referer": `${BASEDOM}/`,
        "Referrer-Policy": "origin",
      },
      "body": null,
      "method": "GET",
    },
  );
  const jsCode = await jsFileReq.text();
  const decryptRegex = /{}\}window\[([^"]+)\("([^"]+)"\)/;
  const decryptMatches = jsCode.match(decryptRegex);
  // ^ this func is the decrypt function (fn name)
  const $ = cheerio.load(prorcpResponse);
  if (!decryptMatches || decryptMatches?.length < 3) return null;
  const id = decrypt(decryptMatches[2].toString().trim(), decryptMatches[1].toString().trim());
  const data = $("#" + id);
  const result = await decrypt(await data.text(), decryptMatches[2].toString().trim());
  return result;
}

async function rcpGrabber(html: string): Promise<RCPResponse | null> {
  const regex = /src:\s*'([^']*)'/;
  const match = html.match(regex);
  if (!match) return null;
  return {
    metadata: {
      title: "",
      image: "",
    },
    data: match[1],
  };
}
async function tmdbScrape(tmdbId: string, type: "movie" | "tv", season?: number, episode?: number) {
  if (season && episode && (type === "movie")) {
    throw new Error("Invalid Data.");
  }
  const url = (type==='movie') 
    ? `https://vidsrc.net/embed/${type}?tmdb=${tmdbId}` 
    : `https://vidsrc.net/embed/${type}?tmdb=${tmdbId}&season=${season}&episode=${episode}`
  const embed = await fetch(url);
  const embedResp = await embed.text();

  const servers = await serversLoad(embedResp);

  const rcpFetchPromises = servers.map(element => {
    return fetch(`${BASEDOM}/rcp/${element.dataHash}`);
  });
  const rcpResponses = await Promise.all(rcpFetchPromises);

  const prosrcrcp = await Promise.all(rcpResponses.map(async (response) => {
    return rcpGrabber(await response.text());
  }));

  const apiResponse: APIResponse[] = [];
  for (const item of prosrcrcp) {
    if (!item) continue;
    switch (item.data.substring(0, 8)) {
      case "/prorcp/":
        apiResponse.push({
          name: item.metadata.title,
          image: item.metadata.image,
          mediaId: tmdbId,
          stream: await PRORCPhandler(item.data.replace("/prorcp/", "")),
        });
        break;
      // 2embed sometimes stops working...(fix later)
      // case "///srcrc":
      //   apiResponse.push({
      //     name: item.metadata.title,
      //     image: item.metadata.image,
      //     mediaId: tmdbId,
      //     stream: item.data,
      //   });
    }
  }
  return (apiResponse);
}

export default tmdbScrape;
