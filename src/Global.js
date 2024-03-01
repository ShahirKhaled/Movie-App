import { useEffect, useState } from "react";

export function useFetchMovie(tmdbGET) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tmdbGET) {
      (async function fetchMovie(query_string = []) {
        const query_strings = [
          "api_key=51f3a29d6dc9a872900b367f0ca7e94a",
          ...query_string,
        ].join("&");
        const url = `https://api.themoviedb.org/3/${tmdbGET}?${query_strings}`;
        const response = await (await fetch(url)).json();
        for (let i = 0; i < response.results.length; i++) {
          const detailsUrl = `https://api.themoviedb.org/3/${
            response.results[i].media_type === "tv" ? "tv" : "movie"
          }/${response.results[i].id}?${query_strings}`;
          const movieDetails = await (await fetch(detailsUrl)).json();
          response.results[i].genres = movieDetails.genres;
          response.results[i].runtime = movieDetails.runtime;
        }

        setData(response);
        setLoading(false);
      })();
    } else {
      (async function () {
        const res = await (
          await fetch("http://192.168.1.100:80/movies")
        ).json();
        setData(res);
        setLoading(false);
      })();
    }
  }, [tmdbGET]);

  return tmdbGET ? [data.results, loading] : [data, loading];
}

export function A({ data, href, children }) {
  const handleClickEvent = (e) => {
    e.preventDefault();
    sessionStorage.setItem("currentMovie", JSON.stringify(data));
    window.history.pushState(null, "", href);
    const navEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent);
  };

  return (
    <a href={href} onClick={handleClickEvent}>
      {children}
    </a>
  );
}
