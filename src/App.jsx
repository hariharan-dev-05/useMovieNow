import { useEffect, useState } from "react";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import Spinner from "./components/Spinner";
import mockMovies from "./mockMovies.json";

const API_HEADERS = {
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
  "x-rapidapi-host": "imdb236.p.rapidapi.com",
};

const buildUrl = (query) => {
  const params = new URLSearchParams();
  params.append("type", "movie");
  params.append("rows", 50);
  params.append("sortOrder", "DESC");
  params.append("sortField", "id");

  if (query) params.append("primaryTitleAutocomplete", query);

  return `https://imdb236.p.rapidapi.com/api/imdb/search?${params.toString()}`;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage("");
    const url = buildUrl(query);

    try {
      const response = await fetch(url, { headers: API_HEADERS });

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error("No movies found from API.");
      }

      setMoviesList(data.results);
    } catch (error) {
      console.error("API error, loading mock data instead:", error.message);
      // Load mock data as fallback
      const filteredMockMovies = query
        ? mockMovies.results.filter((movie) =>
            movie.primaryTitle.toLowerCase().includes(query.toLowerCase())
          )
        : mockMovies.results;

      if (filteredMockMovies.length === 0) {
        setErrorMessage("No movies found (from API or mock data).");
        setMoviesList([]);
      } else {
        setMoviesList(filteredMockMovies);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedTerm);
  }, [debouncedTerm]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy the
            Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;