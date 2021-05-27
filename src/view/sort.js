import AbstractView from './abstract.js';
import {SortTypes} from '../const.js';

const createSortTemplate = (currentSortType) => {
  const activeSort = 'sort__button--active';
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button ${currentSortType == SortTypes.BY_DEFAULT && activeSort}" data-sort-type="${SortTypes.BY_DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${currentSortType == SortTypes.BY_DATE && activeSort}" data-sort-type="${SortTypes.BY_DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${currentSortType == SortTypes.BY_RAITING && activeSort}" data-sort-type="${SortTypes.BY_RAITING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractView {
  constructor(sortType) {
    super();

    this._currentSortType = sortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

}
