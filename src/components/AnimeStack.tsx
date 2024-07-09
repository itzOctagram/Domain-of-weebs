/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
// import { start } from "repl";
import { useAnimeContext } from "../AnimeContext";
export const AnimeStack = (props: AnimeStackProps) => {
  const [animeData, setAnimeData] = useState<
    | null
    | {
        image: string;
        mediaID: string;
        malID: string;
        titleEng: string;
        titleRom: string;
        //startDate: string;
        //endDate: string;
        Progress: string;
      }[]
  >(null); // State to hold the data
  let accessToken: unknown;
  const user = localStorage.getItem("user");
  ///////////////////////////////
  let username: string | undefined;
  if (user) {
    username = JSON.parse(localStorage.getItem("user") as string).username;
    if (JSON.parse(localStorage.getItem("user") as string).access_token) {
      accessToken = JSON.parse(
        localStorage.getItem("user") as string
      ).access_token;
    }
  } else {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    accessToken = hashParams.get("access_token");
    if (!accessToken) {
      console.log("No access token found or its over,connect to anilist");
    }
  }

  // accessToken = "hi";
  // let username = "itzKirito";
  const { triggerFetch, setTriggerFetch } = useAnimeContext();
  useEffect(() => {
    const fetchData = async () => {
      if (!triggerFetch) return;

      const query = `
          query ($username: String) {
            MediaListCollection(userName: $username, type: ANIME) {
              lists {
                name
                entries {
                  mediaId
                  status
                  score
                  progress
                  media {
                    title {
                      romaji
                      english
                    }
                    idMal
                    coverImage {
                      large
                    }
                  }
                }
              }
            }
          }
        `;

      const variables = {
        username: username,
      };

      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        const { data } = await response.json();
        console.log(data);

        if (
          data &&
          data.MediaListCollection &&
          data.MediaListCollection.lists
        ) {
          const lists = data.MediaListCollection.lists;
          const animeList = lists.flatMap((list: any) =>
            list.entries.map((entry: any) => ({
              image: entry.media.coverImage.large,
              mediaID: entry.mediaId,
              malID: entry.media.idMal,
              titleEng: entry.media.title.english,
              titleRom: entry.media.title.romaji,
              //startDate: entry.startedAt,
              //endDate: entry.completedAt,
              Progress: entry.progress,
            }))
          );
          setAnimeData(animeList); // Set the fetched data
          setTriggerFetch(false); // Reset the trigger fetch flag
        }
      } catch (error) {
        console.error("Error fetching anime list:", error);
      }
    };

    fetchData();
  }, [triggerFetch]); // Trigger fetch when the context value changes

  // Render the component
  return (
    <div>
      {animeData ? (
        <div>
          {animeData.map((anime) => (
            <div key={anime.mediaID}>
              <img src={anime.image} alt={anime.titleEng} />
              <p>{anime.titleEng || anime.titleRom}</p>
              <p>{anime.Progress}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
interface AnimeStackProps {
  type: string;
}
