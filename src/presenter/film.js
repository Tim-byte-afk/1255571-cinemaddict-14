import FilmCardView from '../view/film-card';
import FilmPopupView from '../view/film-popup';
import FilmComments from '../view/film-comments';
import {render, replace, remove} from '../utils/render';
import {Places, UserAction, UpdateType} from '../const';

export default class Film {
  constructor(bodySite, filmListContainer, changeData, api) {
    this._siteBodyElement = bodySite;
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._isPopupOpen = false;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._filmPopupCommentsComponent = null;

    this._api = api;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);

    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
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

    if (this._filmListContainer.contains(prevFilmPopupComponent.getElement())) {
      this._renderComments();
      replace(this._filmPopupComponent, prevFilmPopupComponent);
      this._filmPopupComponent.setPopupOpen(this._siteBodyElement);

    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);

  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
    remove(this._filmPopupCommentsComponent);
  }

  _renderComments() {
    this._api.getComments(this._film.id).then((response) => {

      this._filmPopupCommentsComponent = new FilmComments(response);
      this._filmPopupCommentsComponent.setFormSubmitHandler(this._addCommentHandler);
      this._filmPopupCommentsComponent.setCommentDelateHandler(this._deleteCommentHandler);

      const filmDetailsElement = this._filmPopupComponent.getElement().querySelector('.film-details__inner');
      render(filmDetailsElement, this._filmPopupCommentsComponent, Places.BEFOREEND);

    });
  }

  _removePopup() {
    this._filmPopupComponent.setPopupClose(this._siteBodyElement);
    this._filmPopupComponent.getElement().remove();
    this._filmPopupCommentsComponent.getElement().remove();
    this._isPopupOpen = false;
  }

  _closePopup() {
    this._removePopup();
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _openPopup() {
    this._isPopupOpen = true;
    render(this._filmListContainer, this._filmPopupComponent, Places.BEFOREEND);
    this._renderComments();
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

  _handleFavoriteClick(typeForUpdate = UpdateType.MINOR) {
    this._changeData(
      UserAction.UPDATE_FILM,
      typeForUpdate,
      Object.assign(
        {},
        this._film,
        this._film.user_details.favorite = !this._film.user_details.favorite,
      ),
    );
  }

  _handleWatchlistClick(typeForUpdate = UpdateType.MINOR) {
    this._changeData(
      UserAction.UPDATE_FILM,
      typeForUpdate,
      Object.assign(
        {},
        this._film,
        this._film.user_details.watchlist = !this._film.user_details.watchlist,
      ),
    );
  }

  _handleWatchedClick(typeForUpdate = UpdateType.MINOR) {
    this._changeData(
      UserAction.UPDATE_FILM,
      typeForUpdate,
      Object.assign(
        {},
        this._film,
        this._film.user_details.already_watched = !this._film.user_details.already_watched,
        this._film.user_details.watching_date = new Date().toISOString(),
      ),
    );
  }

  _addCommentHandler(newComment) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        {
          comment: newComment.commentText,
          emotion: newComment.emotion,
        },
        {
          id: this._film.id,
        },
      ),
    );
  }

  _deleteCommentHandler(commentId) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        {
          commentId: commentId,
        },
        {
          id: this._film.id,
        },
      ),
    );
  }

  hide() {
    this._filmComponent.hide();
  }

  show() {
    this._filmComponent.show();
  }
}
