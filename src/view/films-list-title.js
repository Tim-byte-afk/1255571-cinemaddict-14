import AbstractView from './abstract.js';

const createLoadingTemplate = (textTitle) => {
  return `<h2 class="films-list__title">${textTitle}</h2>`;
};

export default class FilmsListTitle extends AbstractView {
  constructor(textTitle) {
    super();
    this.textTitle = textTitle;
  }

  getTemplate() {
    return createLoadingTemplate(this.textTitle);
  }

}
