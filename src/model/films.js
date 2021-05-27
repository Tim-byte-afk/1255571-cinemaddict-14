import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType, films);
  }

  getFilms() {
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

  deleteFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType);
  }

  deleteComment(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }
    const film = this._films[index];
    let filmComments = film.comments;
    filmComments = filmComments.filter((comment) => comment.id !== update.commentId);
    film.comments = filmComments;
    this._notify(updateType, film);
  }

  addComment(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }
    const film = this._films[index];
    const filmComments = film.comments;

    const newComment = {
      id: `${update.comment.commentText}+${update.comment.emotion}`,
      author: 'test',
      date: '2019-01-11T16:12:32.554Z',
      comment: `${update.comment.commentText}`,
      emotion: `${update.comment.emotion}`,
    };

    filmComments.push(newComment);
    film.comments = filmComments;
    this._notify(updateType, film);
  }

  static adaptToClient(film) {
    return film;
  }
}
