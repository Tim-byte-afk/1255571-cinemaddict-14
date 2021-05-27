import AbstractView from './abstract.js';

const createNoTaskTemplate = () => {
  return `<p class="board__no-films">
    Loading...
  </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
