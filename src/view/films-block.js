import AbstractView from './abstract.js';

const createFilmsBlockTemplate = () => {
  return (
    `<section class="films">

    </section>`
  );
};

export default class FilmsBlock extends AbstractView {

  getTemplate() {
    return createFilmsBlockTemplate();
  }
}
