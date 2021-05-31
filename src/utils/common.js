import {SortTypes, MONTH_NAMES, FilterTypes, RanksDescription} from '../const';
import dayjs from 'dayjs';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getStringFromArray = (myArray) => {
  let someString = '';
  myArray.forEach((element, index) => {
    if(index < myArray.length) {
      someString = someString + element + ', ';
    } else {
      someString = someString + element;
    }
  });

  return someString;
};

const getSortConditions = (activeSorting) => {
  let sort;

  if (activeSorting === SortTypes.BY_DEFAULT) {
    sort = (a, b) => (b.id - a.id);
  } else if (activeSorting === SortTypes.BY_DATE) {
    sort = (a, b) => (new Date(b.filmInfo.release.date) - new Date(a.filmInfo.release.date));
  } else if (activeSorting === SortTypes.BY_RAITING) {
    sort = (a, b) => (b.filmInfo.totalRating - a.filmInfo.totalRating);
  } else if (activeSorting === SortTypes.BY_COMMENTING) {
    sort = (a, b) => (b.comments.length - a.comments.length);
  }

  return sort;
};

const getFilteredData = (data, activeFilter) => {
  if (activeFilter === FilterTypes.BY_DEFAULT) {
    return data;
  } else if (activeFilter === FilterTypes.WATCHLIST) {
    return data.slice().filter((film) => film.userDetails.watchlist === true);
  } else if (activeFilter === FilterTypes.HISTORY) {
    return data.slice().filter((film) => film.userDetails.alreadyWatched === true);
  } else if (activeFilter === FilterTypes.FAVORITES) {
    return data.slice().filter((film) => film.userDetails.favorite === true);
  }

  return data;
};

const getFilterCounts = (data) => {
  let countWatchlist = 0;
  let countHistory = 0;
  let countFavorites = 0;

  data.forEach((film) => {
    if (film.userDetails.watchlist === true) {
      countWatchlist++;
    }

    if (film.userDetails.alreadyWatched === true) {
      countHistory++;
    }

    if (film.userDetails.favorite === true) {
      countFavorites++;
    }
  });

  return {countWatchlist, countHistory, countFavorites};
};

const getDateFilm = (date) => {
  return new Date(date).getDay() + ' ' + MONTH_NAMES[new Date(date).getMonth()] + ' ' + new Date(date).getFullYear();
};

const getDateComment = (date) => {
  return new Date(date).getFullYear() + '/' + new Date(date).getMonth() + '/' + new Date(date).getDay() + ' ' + new Date(date).getHours() + ':' + new Date(date).getMinutes();
};

const getRank = (films) => {
  let count = 0;

  if (!films.length) {
    return '';
  }

  films.forEach((film) => {
    if (film.userDetails.alreadyWatched === true) {
      count++;
    }
  });

  if (count > 0 && count <= RanksDescription.NOVICE_MIN) {
    return 'novice';
  } else if (count >= RanksDescription.FAN_MIN && count <= RanksDescription.FAN_MAX) {
    return 'fan';
  } else if (count >= RanksDescription.MOVIE_BUFF_MIN) {
    return 'movie buff';
  } else {
    return '';
  }
};

const getRunTime = (films) => {
  let runTime = 0;

  if (!films.length) {
    return runTime;
  }

  films.forEach((film) => {
    runTime = runTime + film.filmInfo.runtime;
  });

  return runTime;
};

const getRunTimeHours = (films) => {
  return parseInt(getRunTime(films) / 60);
};

const getRunTimeMinutes = (films) => {
  return getRunTime(films) % 60;
};

const getWatchedCount = (films) => {
  if (!films.length) {
    return 0;
  }

  return films.filter((film) => film.userDetails.alreadyWatched === true).length;
};

const getAllGenres = (films) => {

  const genres = [];
  films.forEach((film) => {
    genres.push(...film.filmInfo.genre);
  });

  return genres;
};

const getGenresCount = (films) => {
  const allGenres = getAllGenres(films);
  const genresNumbers = [...new Set(getAllGenres(films))].map((genre) => {
    return {
      genreName: genre,
      genreNumber: allGenres.filter((element) => element === genre).length,
    };
  });

  genresNumbers.sort((a, b) => {
    return b.genreNumber - a.genreNumber;
  });

  return genresNumbers;
};


const getGenres = (films) => {
  return getGenresCount(films).map((element) => element.genreName);
};

const getTopGenre = (films) => {
  if (!films.length) {
    return '';
  }
  return getGenresCount(films)[0].genreName;
};

const getGenreNumber = (films) => {
  return getGenresCount(films).map((element) => element.genreNumber);
};

const getFilmsInDateRange = (films, dateFrom) => {
  return films.filter((film) => {
    return dayjs(film.userDetails.watchingDate).isAfter(dateFrom, 'day') || dayjs(film.userDetails.watchingDate).isSame(dateFrom, 'day');
  });
};

const getSortedFilms = (data) => {
  const watchedFilms = data.films.slice().filter((film) => film.userDetails.alreadyWatched === true);
  const sortedFilms = data.dateFrom === null ? watchedFilms.slice() : getFilmsInDateRange(watchedFilms, data.dateFrom);
  return sortedFilms;
};

export {
  getRandomInt,
  getRandomDate,
  getStringFromArray,
  getSortConditions,
  getDateFilm,
  getDateComment,
  getFilteredData,
  getFilterCounts,
  getRank,
  getRunTimeHours,
  getRunTimeMinutes,
  getWatchedCount,
  getTopGenre,
  getSortedFilms,
  getGenres,
  getGenresCount,
  getGenreNumber
};
