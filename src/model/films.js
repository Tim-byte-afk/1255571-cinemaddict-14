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
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
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
    return film;
  }
}
