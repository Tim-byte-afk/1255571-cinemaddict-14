import FilterView from '../view/filter.js';
import {render, replace, remove} from '../utils/render.js';
import {getFilteredData} from '../utils/common';
import {FilterTypes, UpdateType, Places} from '../const.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;
    this._menuItemClickHandler = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterChangeHandler(this._handleFilterTypeChange);
    this._filterComponent.setMenuClickHandler(this._menuItemClickHandler);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, Places.BEFOREBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  setMenuClickHandler(callback) {
    this._menuItemClickHandler = callback;
    this._filterComponent.setMenuClickHandler(callback);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.get();

    return [
      {
        type: FilterTypes.BY_DEFAULT,
        name: 'All movies',
        count: getFilteredData(films, FilterTypes.BY_DEFAULT).length,
      },
      {
        type: FilterTypes.WATCHLIST,
        name: 'Watchlist',
        count: getFilteredData(films, FilterTypes.WATCHLIST).length,
      },
      {
        type: FilterTypes.HISTORY,
        name: 'History',
        count: getFilteredData(films, FilterTypes.HISTORY).length,
      },
      {
        type: FilterTypes.FAVORITES,
        name: 'Favorites',
        count: getFilteredData(films, FilterTypes.FAVORITES).length,
      },
    ];
  }
}
