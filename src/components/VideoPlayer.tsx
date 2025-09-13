import { CurrEpisodeData } from "../interfaces/CurrEpisodeData";
import { useState, useRef, useEffect } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  MediaPlayer,
  useMediaStore,
  useMediaRemote,
  type MediaPlayerInstance,
  MediaProvider,
  TextTrack,
  HLSErrorEvent
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { CustomMenu } from "./VideoPlayerComponents/CustomMenu";
import { SkipButtons } from "./VideoPlayerComponents/SkipButtons";
import { EpisodeControlButtons } from "./VideoPlayerComponents/EpisodeControlButtons";
import { CustomLocalStorage } from "./VideoPlayerComponents/CustomLocalStorage";
import "./VideoPlayerComponents/player.css";
import {
  VTTtoJSON,
  type VTTJSON,
} from "./VideoPlayerComponents/ThumbnailsHandler";
import axios from "axios";
import { handlePlayerMouse } from "./VideoPlayerComponents/handlePlayerMouse";
// import loadingSpinner from "../assests/Loading-Spinner.webp";

enum StreamType {
  sub,
  dub,
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentEpisode,
  hasPreviousEpisode,
  hasNextEpisode,
  handlePreviousEpisode,
  handleNextEpisode,
  onStart,
  onEnd,
  fetchEpisodes,
}) => {
  const player = useRef<MediaPlayerInstance>(null);
  const remote = useMediaRemote(player);
  const { currentTime } = useMediaStore(player);
  const [streamType, setStreamType] = useState<StreamType>(
    JSON.parse(localStorage.getItem("streamType") || "0")
  );
  const [trueStreamType, setTrueStreamType] = useState<StreamType>(streamType);
  const [thumbnails, setThumbnails] = useState<VTTJSON[]>();
  const [storage, setStorage] = useState<CustomLocalStorage>();
  // const [showPoster, setShowPoster] = useState(true);

  // useEffect(() => {
  //   console.warn("changed player");
  //   handlePlayerMouse();
  // }, [player]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("streamType") || "{}") !== streamType)
      localStorage.setItem("streamType", JSON.stringify(streamType));
    if (streamType === StreamType.dub && !currentEpisode.sources.dub)
      setTrueStreamType(StreamType.sub);
    else setTrueStreamType(streamType);
  }, [streamType]);

  useEffect(() => {
    if (trueStreamType === StreamType.sub && currentEpisode.subtitles) {
      currentEpisode.subtitles.forEach((subtitle) => {
        player.current?.textTracks.add(
          new TextTrack({
            src: subtitle.url,
            kind: "subtitles",
            label: subtitle.lang,
            default: subtitle.lang === "English",
            id: subtitle.lang,
          })
        );
      });
    } else {
      currentEpisode.dubSubtitles?.forEach((subtitle) => {
        player.current?.textTracks.add(
          new TextTrack({
            src: subtitle.url,
            kind: "subtitles",
            label: subtitle.lang,
            default: subtitle.lang === "English",
            id: subtitle.lang,
          })
        );
      });
    }

    return () => {
      player.current?.textTracks.clear();
    };
  }, [currentEpisode.subtitles, currentEpisode.dubSubtitles, trueStreamType]);

  useEffect(() => {
    setStorage(new CustomLocalStorage("vidstack-storage", currentEpisode.zoroId, player.current?.textTracks))
  }, [currentEpisode.zoroId, player.current?.textTracks])

  useEffect(() => {
    const fetchThumbnails = async (src: string) => {
      const response = await axios.get(src);
      const thumbnailsVTT = response.data;
      const cleanSrc = src.replace(/thumbnails\.vtt$/, "");
      //if (!thumbnailsVTT) return;
      const thumbnails = VTTtoJSON(thumbnailsVTT, cleanSrc);
      setThumbnails(thumbnails);
    };
    if (trueStreamType === StreamType.sub) {
      if (!currentEpisode.thumbnailSrc)
        return;

      fetchThumbnails(currentEpisode.thumbnailSrc);
    } else {
      if (!currentEpisode.dubThumbnailSrc)
        return;
      fetchThumbnails(currentEpisode.dubThumbnailSrc);
    }
    return () => {
      setThumbnails([]);
    };
  }, [
    currentEpisode.thumbnailSrc,
    currentEpisode.dubThumbnailSrc,
    trueStreamType,
  ]);

  const loadSkipButton: boolean =
    currentEpisode?.intro && currentEpisode?.outro
      ? (currentTime > currentEpisode.intro.start &&
        currentTime < currentEpisode.intro.end) ||
      (currentTime > currentEpisode.outro.start &&
        currentTime < currentEpisode.outro.end)
      : false;

  const skipText: string =
    currentEpisode?.intro && currentTime > currentEpisode.intro.start &&
      currentTime < currentEpisode.intro.end
      ? "Skip Intro"
      : currentEpisode?.outro && currentTime > currentEpisode.outro.start &&
        currentTime < currentEpisode.outro.end
        ? "Skip Outro"
        : "";

  const handleSkip = () => {
    if (
      currentTime > currentEpisode.intro.start &&
      currentTime < currentEpisode.intro.end
    ) {
      remote.seek(currentEpisode.intro.end);
    } else if (
      currentTime > currentEpisode.outro.start &&
      currentTime < currentEpisode.outro.end
    ) {
      remote.seek(currentEpisode.outro.end);
    }
  };

  const handleError = (error: HLSErrorEvent) => {
    //@ts-ignore
    if (error.type === "networkError" && (error.details === "manifestLoadError" || error.details === "fragLoadError") && error.fatal) {
      console.log("ManifestLoadError", error)
      fetchEpisodes(true)
    }
    //@ts-ignore
    else if (error.type === 'mediaError' && (error.details === 'bufferStalledError' || error.details === 'bufferNudgeOnStall') && !error.fatal)
      console.log("Buffering", error)
    else
      console.log("Unregistered Error", error)
  }

  return (
    <div className="relative border border-doki-light-grey rounded-lg">
      {currentEpisode && (
        <>
          <MediaPlayer
            aspectRatio="16/9"
            className="mb-0 pb-0"
            src={[currentEpisode.sources.sub, currentEpisode.sources.dub][trueStreamType]}
            ref={player}
            onHlsError={handleError}
            onCanPlay={() => {
              // setShowPoster(false)
              handlePlayerMouse();
              onStart()
            }}
            onEnd={async () => {
              if (!storage) {
                console.error("Storage is not set")
                return;
              }
              await storage.clearCurrentEpisodeTime();
              onEnd()
            }}
            load="eager"
            posterLoad="eager"
            logLevel="silent"
            storage={storage}
            autoPlay
          >
            <MediaProvider role="button">
              {/* {showPoster &&
                <Poster
                  className="vds-poster"
                  src={loadingSpinner}
                  alt="Loading Screen"
                />
              } */}
            </MediaProvider>
            <DefaultVideoLayout
              icons={defaultLayoutIcons}
              seekStep={5}
              slots={{
                googleCastButton: null,
                settingsMenu: (
                  <CustomMenu
                    trueStreamType={trueStreamType}
                    setStreamType={(streamType) => setStreamType(streamType)}
                    hasDub={!!currentEpisode.sources.dub}
                  />
                ),
                afterEndTime: (
                  <SkipButtons
                    handleSkip={handleSkip}
                    skipText={skipText}
                    loadSkipButton={loadSkipButton}
                  />
                ),
                beforeCaptionButton: (
                  <EpisodeControlButtons
                    hasPreviousEpisode={hasPreviousEpisode}
                    hasNextEpisode={hasNextEpisode}
                    handlePreviousEpisode={handlePreviousEpisode}
                    handleNextEpisode={async () => {
                      if (!storage) {
                        console.error("Storage is not set")
                        return;
                      }
                      await storage.clearCurrentEpisodeTime();
                      handleNextEpisode()
                    }}
                  />
                ),
                // captions: null,
              }}
              thumbnails={thumbnails}
            />
          </MediaPlayer>
        </>
      )}
    </div>
  );
};

interface VideoPlayerProps {
  currentEpisode: CurrEpisodeData;
  hasPreviousEpisode: boolean;
  hasNextEpisode: boolean;
  handlePreviousEpisode: () => void;
  handleNextEpisode: () => void;
  onStart: () => void;
  onEnd: () => void;
  fetchEpisodes: (forceRefetch: boolean) => void;
}
