import AbstractView from './abstract.js';
import {getRank} from '../utils/common';

const createLogoTemplate = (films) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getRank(films)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Logo extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createLogoTemplate(this._films);
  }

}
