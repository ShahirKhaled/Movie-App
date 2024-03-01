import "./MovieSlider.css";
import { A, useFetchMovie } from "../Global";

export default function MovieSlider({ data, sectionTitle }) {
  const localData = useFetchMovie();
  const [localMovies, localMoviesLoading] = localData;
  const [results, loading] = data ? data : localData;
  const randImgs = [];

  if (sectionTitle === "Popular Movies" && !loading && !localMoviesLoading)
    results.forEach((item) => (item.media_type = "movie"));

  if (loading || localMoviesLoading) {
    const strLength = sectionTitle.split(" ")[0].length - 2;
    for (let i = 0; i < strLength; i++) {
      randImgs.push(
        <div key={i}>
          <div className="img skeleton-shimmer"></div>
        </div>
      );
    }
  }

  return (
    <section className="movie-slider-parent">
      <h2 className={loading || localMoviesLoading ? "skeleton-shimmer" : ""}>
        {sectionTitle}
      </h2>
      <div className="movie-slider">
        <div className="thumbnails-wrapper">
          {loading || localMoviesLoading
            ? randImgs
            : results.map((item, index) => {
                const madeupFileName = item.title
                  ? `${item.title.replace(/\s?\W\s/g, " ")} ${new Date(
                      item.release_date
                    ).getUTCFullYear()}.mp4`
                  : "tv";
                const isLocal =
                  sectionTitle === "Local Movies"
                    ? false
                    : localMovies.some((localElem) => item.id === localElem.id);

                return (
                  <div
                    className={"thumbnail" + (isLocal ? " local" : "")}
                    key={(item.title || item.name) + index}
                  >
                    <A data={item} href={`/movie?${madeupFileName}`}>
                      <div className="img">
                        <img
                          src={`http://image.tmdb.org/t/p/w342${item.poster_path}`}
                          alt={madeupFileName}
                        />
                      </div>
                    </A>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
