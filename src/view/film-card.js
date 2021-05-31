import {Variable} from '../const';
import AbstractView from './abstract.js';

const ACTIVE_BUTTON = 'film-card__controls-item--active';

const createFilmCardTemplate = ({id, userDetails, filmInfo, comments}) => {
  const {title, release, runtime, genre, poster, description, totalRating} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const genreList = genre[0];
  const shortDescription = description.length > Variable.MAX_COUNT_CHARACTER ? description.slice(0, Variable.MAX_COUNT_CHARACTER) + '...' : description ;
  const date = new Date(release.date).getFullYear();
  const filmDuration = `${Math.floor(runtime/60)}h ${Math.floor(runtime%60)}m`;

  return (
    `<article id='${id}_${date}' class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${genreList}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist && ACTIVE_BUTTON}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${alreadyWatched && ACTIVE_BUTTON}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite && ACTIVE_BUTTON}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film, changeData) {
    super();
    this._film = film;
    this._changeData = changeData;

    this._clickHandler = this._clickHandler.bind(this);

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement()
      .querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments')
      .forEach((element) => {
        element.addEventListener('click', this._clickHandler);
      });
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }
}
