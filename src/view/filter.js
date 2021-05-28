import AbstractView from './abstract.js';
import {FilterTypes, MenuItem} from '../const';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  const activeItem = 'main-navigation__item--active';
  const itemCount = `<span class="main-navigation__item-count" data-filter-type="${type}">${count}</span>`;

  return (
    `<a href="#${type}" class="main-navigation__item ${currentFilterType === type ? activeItem : ''}" data-filter-type="${type}">${name}  ${type !== FilterTypes.BY_DEFAULT ? itemCount : ''}</a>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterClickHandler(evt) {
    evt.preventDefault();
    this._callback.filterChangeClick(evt.target.dataset.filterType);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterChangeClick = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((element) => {

      element.addEventListener('click', this._filterClickHandler);
    });
  }

  setMenuClickHandler(callback) {
    this._callback.menuItemClick = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((element) => {
      element.addEventListener('click', this._menuClickHandler);
    });
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if(evt.target.classList.contains('main-navigation__item') || evt.target.parentNode.classList.contains('main-navigation__item')) {
      this.getElement().querySelectorAll('.main-navigation__item--active').forEach((element) => {
        element.classList.remove('main-navigation__item--active');
      });
      evt.target.classList.add('main-navigation__item--active');
      this._callback.menuItemClick(MenuItem.FILTER);
    } else if (evt.target.classList.contains('main-navigation__additional')) {
      this.getElement().querySelectorAll('.main-navigation__item--active').forEach((element) => {
        element.classList.remove('main-navigation__item--active');
      });
      evt.target.classList.add('main-navigation__item--active');
      this._callback.menuItemClick(MenuItem.STATISTICS);
    }
  }

}
