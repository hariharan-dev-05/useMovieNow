import React from "react";

const MovieCard = ({
  movie: {
    primaryTitle,
    primaryImage,
    releaseDate,
    spokenLanguages,
    averageRating,
  },
}) => {
  const imageUrl = primaryImage? primaryImage : "/no-movie.png";
  const releaseYear = releaseDate ? releaseDate.split("-")[0] : "NA";
  const language = spokenLanguages?.[0] || "NA";
  const rating = averageRating || "NA";

  return (
    <div className="movie-card">
      <img
        src={imageUrl}
        alt={primaryTitle}
      />
      <div className="mt-4">
        <h3 className="font-bold text-lg mb-1">{primaryTitle}</h3>
        <div className="content text-white">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{rating}</p>
          </div>
          <span>•</span>
          <p>{releaseYear}</p>
          <span>•</span>
          <p className="uppercase">{language}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
