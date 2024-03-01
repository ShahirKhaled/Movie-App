import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import MoviesCarousel from "./Components/home/MoviesCarousel";
import MovieSlider from "./Components/MovieSlider";
import MoviePage from "./Components/movie/MoviePage";
import { useFetchMovie } from "./Global";

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [favorites, setFavorites] = useState(() => getStorageData("favorites"));
  const [watchlist, setWatchlist] = useState(() => getStorageData("watchlist"));
  const popularMoviesData = useFetchMovie("movie/popular");

  useEffect(() => {
    window.addEventListener("changeInStorage", () => {
      setFavorites(getStorageData("favorites"));
      setWatchlist(getStorageData("watchlist"));
    });

    window.addEventListener("popstate", () =>
      setRoute(window.location.pathname)
    );
  }, []);

  return (
    <>
      <Header />
      <main>
        {route === "/" ? (
          <>
            <MoviesCarousel />
            {favorites.length ? (
              <MovieSlider data={[favorites]} sectionTitle="Favorites" />
            ) : null}
            {watchlist.length ? (
              <MovieSlider data={[watchlist]} sectionTitle="Watchlist" />
            ) : null}
            <MovieSlider
              data={popularMoviesData}
              sectionTitle="Popular Movies"
            />
            <MovieSlider sectionTitle="Local Movies" />
          </>
        ) : (
          <MoviePage />
        )}
      </main>
    </>
  );

  function getStorageData(storageKey) {
    return localStorage[storageKey]
      ? JSON.parse(localStorage.getItem(storageKey))
      : [];
  }
}

export default App;
