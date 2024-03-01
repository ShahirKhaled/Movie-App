import MovieInfo from "../MovieInfo";

export default function MoviePage() {
  return (
    <MovieInfo data={JSON.parse(sessionStorage.getItem("currentMovie"))} />
  );
}
