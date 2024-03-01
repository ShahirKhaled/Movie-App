import { useState, useRef } from "react";
import "./Header.css";

function Header() {
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState(false);
  const input = useRef();
  const form = useRef();
  const ul = useRef();

  const searchClick = (e) => {
    search ? setSearch(false) : setSearch(true);
    form.current.classList.toggle("open");
    setSearchResults([]);
  };

  const submit = async (e) => {
    if (e.key !== "Enter") return;
    const url =
      "http://api.themoviedb.org/3/search/multi?api_key=51f3a29d6dc9a872900b367f0ca7e94a";
    const response = await (
      await fetch(`${url}&query=${input.current.value}`)
    ).json();
    setSearchResults(response.results);
  };

  const hamburgerClick = (e) => {
    e.target.classList.toggle("open");
    ul.current.classList.toggle("open");
  };

  return (
    <header>
      <button className="hamburger-button" onClick={hamburgerClick}>
        <div className="hamburger">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </button>
      <div className="logo">HomeTheatre 🎬</div>
      <nav>
        <ul ref={ul}>
          <li>Home</li>
          <li>Courses</li>
          <li>Tv-Shows</li>
        </ul>
        <div ref={form} className="form">
          <input
            ref={input}
            type="text"
            id="searchBar"
            placeholder="Type To Search"
            onKeyUp={submit}
          />
          <button id="search-button" onClick={searchClick}>
            {search ? (
              <div className="cross">
                <div></div>
                <div></div>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
              </svg>
            )}
          </button>
        </div>
      </nav>
      <div id="search-results">
        {searchResults.map((item) => (
          <div className="img">
            <img
              src={`http://image.tmdb.org/t/p/w342${item.poster_path}`}
              alt={item.title ? item.title : item.name}
            />
          </div>
        ))}
      </div>
    </header>
  );
}

export default Header;
