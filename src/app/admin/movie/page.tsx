"use client"
import { AddMovie } from "./add-movie";
import { MovieList } from "./movie-list";

const MoviePage = () => {
  return (
    <div>
      <AddMovie />
      <br />
      <MovieList />
    </div>
  );
};

export default MoviePage;
