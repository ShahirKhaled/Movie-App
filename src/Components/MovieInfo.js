import { useState } from "react";
import { A } from "../Global";
import "./MovieInfo.css";

export default function MovieInfo({ data, isLocal }) {
  const [favoriteComponent, setFavoriteComponent] = useState(() =>
    updateState("favorites")
  );
  const [watchListComponent, setWatchListComponent] = useState(() =>
    updateState("watchlist")
  );
  const windowQueryString = window.location.search.replace("%20", " ");
  const videoName = windowQueryString.slice(1, windowQueryString.length);
  const name = data ? data.title || data.name : null;
  const year =
    data && data.release_date
      ? new Date(data.release_date).getUTCFullYear()
      : null;
  const madeupFileName =
    data && data.title
      ? `${data.title.replace(/\s?\W\s/g, " ")} ${year}.mp4`
      : "tv";
  const ratingAverage = data ? (data.vote_average * 10).toFixed(1) : null;
  const genres = [];
  const backgroundImage = data
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), 100%, black 110%), url('http://image.tmdb.org/t/p/w1280${data.backdrop_path}')`,
      }
    : {};

  if (data) data.genres.forEach((genre) => genres.push(genre.name));

  return (
    <div
      className={"movie-info-parent" + (data ? "" : " skeleton")}
      style={backgroundImage}
    >
      <div className={"img" + (data ? "" : " skeleton-shimmer")}>
        <img
          src={data ? `http://image.tmdb.org/t/p/w342${data.poster_path}` : ""}
          alt={name}
        />
      </div>
      <div className="description">
        <div className="details">
          {data ? (
            <h2>
              {name} <span>{year ? `(${year})` : null}</span>
            </h2>
          ) : (
            <>
              <div className="h2 skeleton-shimmer"></div>
              <div className="h2 skeleton-shimmer"></div>
            </>
          )}
          <span className={"media-type" + (data ? "" : " skeleton-shimmer")}>
            {data ? data.media_type : ""}
          </span>
          <span className="genres">
            {data ? (
              genres.join(", ")
            ) : (
              <span className="skeleton-shimmer"></span>
            )}
          </span>
          {data && data.media_type === "movie" ? (
            <span className="length">{data.runtime} min</span>
          ) : null}
        </div>
        <div className="info">
          <div className={"progress-bar" + (data ? "" : " skeleton-shimmer")}>
            <svg>
              <circle r="1.75rem" cx="50%" cy="50%" className="circle" />
              <circle
                r="1.75rem"
                cx="50%"
                cy="50%"
                className="percentage-circle"
                style={{
                  strokeDasharray: `calc(${ratingAverage} / 100 * calc(2 * 22 / 7 * 1.75rem)), calc(2 * 22 / 7 * 1.75rem)`,
                }}
              />
            </svg>
            <span>{ratingAverage}%</span>
          </div>
          {isLocal ? (
            <A data={data} href={`/movie?${madeupFileName}`}>
              <div
                className={"play-button" + (data ? "" : " skeleton-shimmer")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z" />
                </svg>
              </div>
            </A>
          ) : null}
          <button
            className={data ? "" : "skeleton-shimmer"}
            onClick={() => addToList("favorites")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill={favoriteComponent ? "var(--hex-red)" : "var(--hex-white)"}
                d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
              />
            </svg>
          </button>
          <button
            className={"watchlist-button" + (data ? "" : " skeleton-shimmer")}
            onClick={() => addToList("watchlist")}
          >
            {watchListComponent ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z" />
              </svg>
            )}
          </button>
        </div>
        {videoName ? (
          <video controls>
            <source
              src={`http://192.168.1.100:80/video/${videoName}`}
              type="video/mp4"
            />
          </video>
        ) : null}
        {data ? (
          <p>{data ? data.overview : ""}</p>
        ) : (
          <>
            <div className="paragraph skeleton-shimmer"></div>
            <div className="paragraph skeleton-shimmer"></div>
            <div className="paragraph skeleton-shimmer"></div>
            <div className="paragraph skeleton-shimmer"></div>
          </>
        )}
      </div>
    </div>
  );

  function addToList(storageKey) {
    const local = JSON.parse(localStorage.getItem(storageKey));
    if (storageKey === "favorites") {
      if (favoriteComponent) {
        remove();
        setFavoriteComponent(false);
      } else {
        add();
        setFavoriteComponent(true);
      }
    }

    if (storageKey === "watchlist") {
      if (watchListComponent) {
        remove();
        setWatchListComponent(false);
      } else {
        add();
        setWatchListComponent(true);
      }
    }

    function remove() {
      let arrIndx;
      for (let i = 0; i < local.length; i++) {
        if (local[i].id === data.id) arrIndx = i;
        else continue;
      }
      if (!isNaN(arrIndx)) local.splice(arrIndx, 1);
      localStorage.setItem(storageKey, JSON.stringify(local));
    }

    function add() {
      localStorage.setItem(
        storageKey,
        JSON.stringify(local ? [data, ...local] : [data])
      );
    }

    window.dispatchEvent(new Event("changeInStorage"));
  }

  function updateState(storageKey) {
    const movieData = JSON.parse(localStorage.getItem(storageKey));
    return movieData && data
      ? movieData.some((item) => item.id === data.id)
      : false;
  }
}
