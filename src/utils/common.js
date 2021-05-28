import {SortTypes, MONTH_NAMES, FilterTypes} from '../const';
import dayjs from 'dayjs';

const NOVICE_MIN = 10;

const FAN_MIN = 11;
const FAN_MAX = 20;

const MOVIE_BUFF_MIN = 21;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray, count) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  if (someArray.length < count) {
    count = someArray.length;
  }

  const newArray = [];
  for (let i = 0; i < count; i++) {
    newArray.push(someArray[i]);
  }

  return newArray;
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const arrayToString = (myArray) => {
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

const sortConditions = (activeSorting) => {
  let sort;

  if (activeSorting === SortTypes.BY_DEFAULT) {
    sort = (a, b) => (b.id - a.id);
  } else if (activeSorting === SortTypes.BY_DATE) {
    sort = (a, b) => (new Date(b.film_info.release.date) - new Date(a.film_info.release.date));
  } else if (activeSorting === SortTypes.BY_RAITING) {
    sort = (a, b) => (b.film_info.total_rating - a.film_info.total_rating);
  } else if (activeSorting === SortTypes.BY_COMMENTING) {
    sort = (a, b) => (b.comments.length - a.comments.length);
  }

  return sort;
};

const filtering = (data, activeFilter) => {
  if (activeFilter === FilterTypes.BY_DEFAULT) {
    return data;
  } else if (activeFilter === FilterTypes.WATCHLIST) {
    return data.slice().filter((film) => film.user_details.watchlist === true);
  } else if (activeFilter === FilterTypes.HISTORY) {
    return data.slice().filter((film) => film.user_details.already_watched === true);
  } else if (activeFilter === FilterTypes.FAVORITES) {
    return data.slice().filter((film) => film.user_details.favorite === true);
  }

  return data;
};

const getFilterCounts = (data) => {
  let countWatchlist = 0;
  let countHistory = 0;
  let countFavorites = 0;

  data.forEach((film) => {
    if (film.user_details.watchlist === true) {
      countWatchlist++;
    }

    if (film.user_details.already_watched === true) {
      countHistory++;
    }

    if (film.user_details.favorite === true) {
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
    if (film.user_details.already_watched === true) {
      count++;
    }
  });

  if (count > 0 && count <= NOVICE_MIN) {
    return 'novice';
  } else if (count >= FAN_MIN && count <=FAN_MAX) {
    return 'fan';
  } else if (count >= MOVIE_BUFF_MIN) {
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
    runTime = runTime + film.film_info.runtime;
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

  return films.filter((film) => film.user_details.already_watched === true).length;
};

const getAllGenres = (films) => {

  const genres = [];
  films.forEach((film) => {
    genres.push(...film.film_info.genre);
  });

  return genres;
};

const getGenresCount = (films) => {
  const genresNumbers = [...new Set(getAllGenres(films))].map((genre) => {
    return {
      genreName: genre,
      genreNumber: getAllGenres(films).filter((element) => element === genre).length,
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
    return dayjs(film.user_details.watching_date).isAfter(dateFrom, 'day') || dayjs(film.user_details.watching_date).isSame(dateFrom, 'day');
  });
};

const getSortedFilms = (data) => {
  const watchedFilms = data.films.slice().filter((film) => film.user_details.already_watched === true);
  const sortedFilms = data.dateFrom === null ? watchedFilms.slice() : getFilmsInDateRange(watchedFilms, data.dateFrom);
  return sortedFilms;
};

export {
  shuffle,
  getRandomInt,
  getRandomDate,
  arrayToString,
  sortConditions,
  getDateFilm,
  getDateComment,
  filtering,
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
