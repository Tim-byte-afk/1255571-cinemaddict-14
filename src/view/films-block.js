import {createElement} from '../utils/common';

const createFilmsBlockTemplate = () => {
  return (
    `<section class="films">

    </section>`
  );
};

export default class FilmsBlock {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsBlockTemplate();
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
