import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  set(updateType, films) {
    this._films = films.slice();

    this._notify(updateType, films);
  }

  get() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const updateClient = Films.adaptToClient(update);
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateClient,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, updateClient);
  }

  addFilm(updateType, update) {
    this._films = [
      update,
      ...this._films,
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }
    const film = this._films[index];
    let filmComments = film.comments;
    filmComments = filmComments.filter((comment) => comment !== update.commentId);
    film.comments = filmComments;

    this._films = [
      ...this._films.slice(0, index),
      film,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, film);
  }

  addComment(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.movie.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }
    const film = this._films[index];

    film.comments = update.movie.comments;

    this._films = [
      ...this._films.slice(0, index),
      film,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, film);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        id: film.id,
        comments: film.comments,
        'filmInfo': {
          'title': film['film_info'].title,
          'alternativeTitle': film['film_info'].alternative_title,
          'totalRating': film['film_info'].total_rating,
          'poster': film['film_info'].poster,
          'ageRating': film['film_info'].age_rating,
          'director': film['film_info'].director,
          'writers': film['film_info'].writers,
          'actors': film['film_info'].actors,
          'release': {
            'date':  film['film_info'].release.date,
            'releaseCountry': film['film_info'].release.release_country,
          },
          'runtime': film['film_info'].runtime,
          'genre': film['film_info'].genre,
          'description': film['film_info'].description,
        },
        'userDetails': {
          'watchlist': film['user_details'].watchlist,
          'alreadyWatched': film['user_details'].already_watched,
          'watchingDate': film['user_details'].watching_date,
          'favorite': film['user_details'].favorite,
        },
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    return  Object.assign(
      {},
      {
        id: film.id,
        comments: film.comments,
        'film_info': {
          'title': film['filmInfo'].title,
          'alternative_title': film['filmInfo'].alternativeTitle,
          'total_rating': film['filmInfo'].totalRating,
          'poster': film['filmInfo'].poster,
          'age_rating': film['filmInfo'].ageRating,
          'director': film['filmInfo'].director,
          'writers': film['filmInfo'].writers,
          'actors': film['filmInfo'].actors,
          'release': {
            'date':  film['filmInfo'].release.date,
            'release_country': film['filmInfo'].release.releaseCountry,
          },
          'runtime': film['filmInfo'].runtime,
          'genre': film['filmInfo'].genre,
          'description': film['filmInfo'].description,
        },
        'user_details': {
          'watchlist': film['userDetails'].watchlist,
          'already_watched': film['userDetails'].alreadyWatched,
          'watching_date': film['userDetails'].watchingDate,
          'favorite': film['userDetails'].favorite,
        },
      },
    );
  }
}
