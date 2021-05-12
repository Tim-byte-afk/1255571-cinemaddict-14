import SortView from '../view/sort';
import FilmsBlockView from '../view/films-block';
import UpcomingFilmsView from '../view/upcoming-films';
import TopRatedFilms from '../view/top-rated-films';
import MostCommentedFilmsView from '../view/most-commented-films';
import FilmPresenter from './films';
import ShowMoreButtonView from '../view/show-more-button';
import FilmsListTitleView from '../view/films-list-title';
import {render, remove} from '../utils/render';
import {updateItem, sorting} from '../utils/common';
import {
  Variable,
  Places,
  Titles,
  SortTypes
} from '../const';

export default class Board {
  constructor(bodySite, boardContainer) {
    this._siteBodyElement = bodySite;
    this._boardContainer = boardContainer;

    this._currentSortType = SortTypes.BY_DEFAULT;

    this._renderedFilmsCount = Variable.FILM_COUNT;
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._filmsBlockComponent = new FilmsBlockView();
    this._upcomingFilmsComponent = new UpcomingFilmsView();
    this._topRatedComponent = new TopRatedFilms();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsView();
    this._sortComponent = new SortView();
    this._noFilmsComponent = new FilmsListTitleView(Titles.EMPTY);

    this._filmPresenter = {};
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();
    this._sourcedBoardTasks = boardFilms.slice();

    render(this._boardContainer, this._filmsBlockComponent, Places.BEFOREEND);
    render(this._filmsBlockComponent, this._upcomingFilmsComponent, Places.BEFOREEND);

    this._renderBoard();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderBoard();
  }

  _renderSort() {
    render(this._filmsBlockComponent, this._sortComponent, Places.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortTypes.BY_DATE:
        this._boardFilms = sorting(this._boardFilms, SortTypes.BY_DATE);
        break;
      case SortTypes.BY_RAITING:
        this._boardFilms = sorting(this._boardFilms, SortTypes.BY_RAITING);
        break;
      default:
        this._boardFilms = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = Variable.FILM_COUNT;
    remove(this._showMoreButtonComponent);
  }

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm, this._upcomingFilmsComponent);
  }

  _renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(this._siteBodyElement, this._boardContainer, this._handleFilmChange);
    filmPresenter.init(film, container);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(from, to, container) {
    this._boardFilms
      .slice(from, to)
      .forEach((film) => this._renderFilm(film, container));
  }

  _renderFilmsList() {
    this._renderFilms(0, Variable.FILM_COUNT, this._upcomingFilmsComponent);

    if(this._boardFilms.length > Variable.FILM_COUNT) {
      this._renderLoadMoreButton();
    }
  }

  _renderNoTasks() {
    render(this._upcomingFilmsComponent, this._noFilmsComponent, Places.BEFOREEND);
  }

  _handleLoadMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + Variable.FILM_COUNT, this._upcomingFilmsComponent);

    this._renderedFilmsCount += Variable.FILM_COUNT;

    if (this._renderedFilmsCount >= this._boardFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {

    render(this._upcomingFilmsComponent, this._showMoreButtonComponent, Places.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => this._handleLoadMoreButtonClick());
  }

  _renderBoard() {
    if (this._boardFilms.length === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();

    this._renderFilmsList();
  }
}
