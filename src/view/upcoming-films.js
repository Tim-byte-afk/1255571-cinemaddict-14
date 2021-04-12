import {createElement} from '../utils/common';

const createUpcomingFilmsTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container films-list__upcoming">

      </div>
    </section>`
  );
};

export default class UpcomingFilms {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createUpcomingFilmsTemplate();
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
