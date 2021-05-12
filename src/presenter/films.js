import FilmCardView from '../view/film-card';
import FilmPopupView from '../view/film-popup';
import {render, replace, remove} from '../utils/render';
import {Places} from '../const';

export default class Film {
  constructor(bodySite, filmListContainer, changeData) {
    this._siteBodyElement = bodySite;
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(film, container) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film);

    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);

    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);

    this._filmComponent.setClickHandler(() => {
      this._openPopup();
      document.addEventListener('keydown', this._onEscKeyDown);
    });

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(container.getContainerForRender(), this._filmComponent, Places.BEFOREEND);

      return;
    }

    if (container.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (container.getElement().contains(prevFilmPopupComponent.getElement())) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);

    this._openPopup();
    document.addEventListener('keydown', this._onEscKeyDown);

  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
  }

  _removePopup() {
    this._filmPopupComponent.setPopupClose(this._siteBodyElement);
    this._filmPopupComponent.getElement().remove();
  }

  _closePopup() {
    this._removePopup();
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _openPopup() {
    render(this._filmListContainer, this._filmPopupComponent, Places.BEFOREEND);
    this._filmPopupComponent.setPopupOpen(this._siteBodyElement);

    this._filmPopupComponent.setClickHandler(this._closePopup);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          user_details: {
            favorite: !this._film.user_details.favorite,
          },
        },
      ),
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          user_details: {
            watchlist: !this._film.user_details.watchlist,
          },
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          user_details: {
            already_watched: !this._film.user_details.already_watched,
            watching_date: Date.now(),
          },
        },
      ),
    );
  }
}
