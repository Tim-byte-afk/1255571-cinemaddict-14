import {createElement} from '../utils/common';

const createLoadingTemplate = (textTitle) => {
  return `<h2 class="films-list__title">${textTitle}</h2>`;
};

export default class FilmsListTitle {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadingTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
