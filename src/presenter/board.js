import SortView from '../view/sort';
import FilmsBlockView from '../view/films-block';
import UpcomingFilmsView from '../view/upcoming-films';
import TopRatedFilms from '../view/top-rated-films';
import MostCommentedFilmsView from '../view/most-commented-films';
import FilmPresenter from './film';
import ShowMoreButtonView from '../view/show-more-button';
import FilmsListTitleView from '../view/films-list-title';
import LoadingView from '../view/loading.js';
import LogoView from '../view/logo';
import {render, remove} from '../utils/render';
import {sortConditions, filtering} from '../utils/common';
import {
  Variable,
  Places,
  Titles,
  SortTypes,
  UpdateType,
  UserAction
} from '../const';

export default class Board {
  constructor(bodySite, boardContainer, filmsModel, filterModel, siteHeaderElement, api) {
    this._filmsModel = filmsModel;
    this._siteBodyElement = bodySite;
    this._boardContainer = boardContainer;
    this._siteHeaderContainer = siteHeaderElement;

    this._filterModel = filterModel;

    this._currentSortType = SortTypes.BY_DEFAULT;

    this._renderedFilmsCount = Variable.FILM_COUNT;

    this._isLoading = true;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsBlockComponent = new FilmsBlockView();
    this._upcomingFilmsComponent = new UpcomingFilmsView();
    this._topRatedComponent = new TopRatedFilms();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsView();
    this._noFilmsComponent = new FilmsListTitleView(Titles.EMPTY);
    this._loadingComponent = new LoadingView();
    this._logoComponent = null;

    this._filmPresenter = {};
    this._api = api;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {

    render(this._boardContainer, this._filmsBlockComponent, Places.BEFOREEND);
    render(this._filmsBlockComponent, this._upcomingFilmsComponent, Places.BEFOREEND);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.get();
    const filtredFilms = filtering(films, filterType);

    this._renderLogo(films);

    switch (this._currentSortType) {
      case SortTypes.BY_DATE:
        return filtredFilms.slice().sort(sortConditions(SortTypes.BY_DATE));
      case SortTypes.BY_RAITING:
        return filtredFilms.slice().sort(sortConditions(SortTypes.BY_RAITING));
    }

    return filtredFilms;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearBoard({resetRenderedFilmCount: true});
    this._renderBoard();
  }

  _renderLogo(films) {
    if(this._logoComponent !== null) {
      remove(this._logoComponent);
    }
    if (films === null) {
      this._logoComponent = new LogoView([]);
      return;
    }

    this._logoComponent = new LogoView(films);
    render(this._siteHeaderContainer, this._logoComponent, Places.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsBlockComponent, this._sortComponent, Places.BEFOREBEGIN);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_FILM:
        this._filmsModel.addFilm(updateType, update);
        break;
      case UserAction.DELETE_FILM:
        this._filmsModel.deleteFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update, update.id).then((response) => {
          this._filmsModel.addComment(updateType, response);
        });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update.commentId).then(() => {
          this._filmsModel.deleteComment(updateType, update);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].init(data, this._upcomingFilmsComponent);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _renderLoading() {
    render(this._upcomingFilmsComponent, this._loadingComponent, Places.AFTERBEGIN);
  }

  _renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(this._siteBodyElement, this._boardContainer, this._handleViewAction, this._api);
    filmPresenter.init(film, container);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(films) {
    films.forEach((task) => this._renderFilm(task, this._upcomingFilmsComponent));
  }

  _renderNoTasks() {
    render(this._upcomingFilmsComponent, this._noFilmsComponent, Places.BEFOREEND);
  }

  _handleLoadMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedTaskCount = Math.min(filmCount, this._renderedFilmsCount + Variable.FILM_COUNT);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedTaskCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedTaskCount;

    if (this._renderedFilmsCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(() => this._handleLoadMoreButtonClick());

    render(this._upcomingFilmsComponent, this._showMoreButtonComponent, Places.BEFOREEND);
  }

  _renderBoard() {

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();

    this._renderFilms(films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));

    if (filmsCount > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }
  }

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((filmPresenter) => filmPresenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);
    remove(this._logoComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = Variable.FILM_COUNT;
    } else {
      this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortTypes.BY_DEFAULT;
    }
  }

  hide() {
    if (Object.keys(this._filmPresenter).length) {
      Object.values(this._filmPresenter)
        .forEach((filmPresenter) => filmPresenter.hide());
      this._sortComponent.hide();
      this._showMoreButtonComponent.hide();
    }
  }

  show() {
    if (Object.keys(this._filmPresenter).length) {
      Object.values(this._filmPresenter)
        .forEach((filmPresenter) => filmPresenter.show());
      this._showMoreButtonComponent.show();
    }
    this._sortComponent.show();
  }
}
