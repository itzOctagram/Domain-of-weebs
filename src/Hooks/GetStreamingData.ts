//TODO: Refactor MongoDB dependency | Atlas App Services and Device Sync have retired

import { CurrEpisodeData } from "../interfaces/CurrEpisodeData";
import { consumetZoro } from "./LoadBalancer";
import axios from "axios";

// Helper functions for caching
const getCachedData = (cacheKey: string) => {
  const cached = sessionStorage.getItem(cacheKey);
  return cached ? JSON.parse(cached) : {};
};

const setCachedData = (cacheKey: string, cacheData: any) => {
  sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
};

// Function to get anime data with caching (no MongoDB)
export const getAnimeData = async (
  malId: number,
  name: string,
  forceRefresh = false
): Promise<AnimeWatchData> => {
  const cacheKey = `animeCache`;
  const animeCache = getCachedData(cacheKey);

  if (!forceRefresh && animeCache[malId]) {
    console.log("Returning cached anime data for malId:", malId);
    return animeCache[malId];
  }

  // Search for zoroId directly without MongoDB
  const zoroId = await searchZoroId(malId, name);

  const response = await consumetZoro(`info?id=${zoroId}`);
  const animeResponse: AnimeWatchData = response.data;

  animeCache[malId] = animeResponse;
  setCachedData(cacheKey, animeCache);

  return animeResponse;
};

// Function to get current episode data with caching
export const getCurrentEpisodeData = async (
  id: string,
  hasDub: boolean,
  forceRefresh = false
): Promise<CurrEpisodeData> => {
  const cacheKey = `episodeCache`;
  const episodeCache = getCachedData(cacheKey);

  if (!forceRefresh && episodeCache[id]) {
    console.log("Returning cached episode data for id:", id);
    return episodeCache[id];
  }

  // Helper function for YumaAPI
  const yumaZoro = async (query: string) => {
    const url = `https://yumaapi.vercel.app/${query}`;
    return await axios.get(url);
  };

  const subResponse = yumaZoro(`watch?episodeId=${id}`);
  const dubResponse = hasDub
    ? yumaZoro(`watch?episodeId=${id.replace(/(\$both|\$sub)$/, "$dub")}`)
    : null;

  const results = await Promise.allSettled([subResponse, dubResponse]);

  let subData = results[0].status === "fulfilled" ? results[0].value : null;
  const dubData =
    dubResponse && results[1].status === "fulfilled" ? results[1].value : null;

  if (!subData || !subData.data) {
    console.log("Converting episode id");
    const newId = id.includes("$both")
      ? id.replace("$both", "$sub")
      : id.replace("$sub", "$both");
    subData = await yumaZoro(`watch?episodeId=${newId}`);
  }

  if (!subData && !dubData) {
    throw new Error("Sub data not found, Dubdata not found");
  }

  if (subData && subData.data) {
    const thumbSrcObj: { url: string; lang: string } | null = subData.data
      .subtitles
      ? subData.data.subtitles.find(
          (sub: { url: string; lang: string }) =>
            sub.lang && sub.lang.toLowerCase() === "thumbnails"
        )
      : null;
    const dubThumbSrcObj: { url: string; lang: string } | null =
      dubData && dubData.data && dubData.data.subtitles
        ? dubData.data.subtitles.find(
            (sub: { url: string; lang: string }) =>
              sub.lang && sub.lang.toLowerCase() === "thumbnails"
          )
        : null;
    const subtitlesList: { url: string; lang: string }[] | null = subData.data
      .subtitles
      ? subData.data.subtitles.filter(
          (sub: { url: string; lang: string }) =>
            sub.lang && sub.lang.toLowerCase() !== "thumbnails"
        )
      : null;

    const dubSubtitlesList: { url: string; lang: string }[] | null = dubData
      ?.data.subtitles
      ? dubData.data.subtitles.filter(
          (sub: { url: string; lang: string }) =>
            sub.lang && sub.lang.toLowerCase() !== "thumbnails"
        )
      : null;

    const episodeData: CurrEpisodeData = {
      zoroId: id,
      intro: subData.data.intro,
      outro: subData.data.outro,
      sources: {
        sub: subData.data.sources[0].url.replace(
          /https?:\/\/d([a-z]).netmagcdn.com:2228\/hls-playback/,
          "/api-$1"
        ),
        dub:
          dubData && dubData.data
            ? dubData?.data.sources[0].url.replace(
                /https?:\/\/d([a-z]).netmagcdn.com:2228\/hls-playback/,
                "/api-$1"
              )
            : null,
      },
      thumbnailSrc: thumbSrcObj?.url.replace(
        "https://mgstatics.xyz/thumbnails",
        "/api-thumb"
      ),
      dubThumbnailSrc: dubThumbSrcObj?.url.replace(
        "https://mgstatics.xyz/thumbnails",
        "/api-thumb"
      ),
      subtitles: subtitlesList?.map((sub: { url: string; lang: string }) => ({
        url: sub.url.replace("https://mgstatics.xyz/subtitle", "/api-sub"),
        lang: sub.lang,
      })),
      dubSubtitles: dubSubtitlesList?.map(
        (sub: { url: string; lang: string }) => ({
          url: sub.url.replace("https://mgstatics.xyz/subtitle", "/api-sub"),
          lang: sub.lang,
        })
      ),
    };

    if (episodeData.subtitles) {
      episodeData.subtitles = episodeData.subtitles.filter(
        (sub, index, self) =>
          index === self.findIndex((t) => t.lang === sub.lang)
      );
    }
    episodeData.dubSubtitles = episodeData.dubSubtitles?.filter(
      (sub, index, self) => index === self.findIndex((t) => t.lang === sub.lang)
    );

    episodeCache[id] = episodeData;
    setCachedData(cacheKey, episodeCache);

    return episodeData;
  }

  throw new Error("Sub data not found, Dubdata found");
};

// Search for Zoro ID directly (no MongoDB)
const searchZoroId = async (malId: number, name: string): Promise<string> => {
  const animeResponses: any = (await consumetZoro(name)).data.results;
  console.log("Searching for:", name);

  for (let i = 0; i < animeResponses.length; i++) {
    const anime = animeResponses[i];
    const response = await consumetZoro(`info?id=${anime.id}`);

    if (response.data.malID == malId) {
      return response.data.id;
    }
  }
  throw new Error("Anime not found in Zoro");
};

export interface AnimeWatchData {
  id: string;
  title: string;
  malID: number;
  alID: number;
  image: string;
  description: string;
  totalEpisodes: number;
  hasSub: boolean;
  hasDub: boolean;
  episodes: Episode[];
}

interface Episode {
  id: string;
  number: number;
  title: string;
}
