import { useEffect, useState } from "react";
import Raiting from "./rating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedid, setSelectedid] = useState(null);

  const KEY = "f573d714";

  function handleSelectid(id) {
    setSelectedid(id);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function moviesBack() {
    setSelectedid(null);
  }

  useEffect(
    function () {
      if (query === "") return;

      async function fetchingData() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok) throw new Error("Something went wrong");
          const data = await res.json();

          // if (data.Response === "False") throw new Error("movie Not Found");

          // Log the API response for debugging

          setMovies(data.Search || []);
        } catch (error) {
          console.error(error.message);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchingData();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {!isLoading && !error && (
            <MoviesList movies={movies} handleSelectid={handleSelectid} />
          )}
          {error && <ErorMessage message={error} />}
          {isLoading && <Loader />}
        </Box>
        <Box>
          {selectedid ? (
            <MovieDetails
              selectedid={selectedid}
              setSelectedid={setSelectedid}
              moviesBack={moviesBack}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <MovieTitle watched={watched} />
              <MovieWatchedList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Loader() {
  return <p className="loader">loading...</p>;
}

function ErorMessage({ message }) {
  return <p className="loader">{message}</p>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);
//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <MovieTitle watched={watched} />
//           <MovieWatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function MovieWatchedList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <MovieWatched movie={movie} />
      ))}
    </ul>
  );
}
function MovieWatched({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function MoviesList({ movies, handleSelectid }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectid={handleSelectid}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectid }) {
  return (
    <li
      key={movie.imdbID}
      onClick={() => handleSelectid(movie.imdbID)}
      className="list"
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MovieTitle({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{parseFloat(avgImdbRating).toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{parseFloat(avgUserRating).toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{parseFloat(avgRuntime).toFixed(2)}min</span>
        </p>
      </div>
    </div>
  );
}

function MovieDetails({
  selectedid,
  moviesBack,
  onAddWatched,
  setSelectedid,
  watched,
}) {
  const [movies, setMovies] = useState({});

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedid);

  const [islading, setIsloading] = useState(false);
  const [userRating, setuserRating] = useState(0);
  const watchedUserrating = watched.find(
    (movie) => movie.imdbID === selectedid
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movies;

  useEffect(
    function () {
      document.title = `Movie | ${title}`;
    },
    [title]
  );

  function handleAdd() {
    const newMovie = {
      imdbID: selectedid,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: parseInt(runtime, 10),
      imdbRating: Number(imdbRating),
      userRating,
    };
    onAddWatched(newMovie);
    setSelectedid(null);
  }

  useEffect(
    function () {
      setIsloading(true);
      async function getData() {
        const KEY = "f573d714";

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedid}`
        );
        const data = await res.json();
        setMovies(data);
        setIsloading(false);
      }

      getData();
    },
    [selectedid]
  );

  return (
    <div className="details">
      {islading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={moviesBack}>
              &larr;
            </button>
            <img src={poster} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
                imdb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>You rated {watchedUserrating} ⭐ this movie</p>
              ) : (
                <>
                  <Raiting maxRating={10} onSetrating={setuserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      add movie
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>starring {actors}</p>
            <p>Directed by {director} </p>
          </section>
        </>
      )}
    </div>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
