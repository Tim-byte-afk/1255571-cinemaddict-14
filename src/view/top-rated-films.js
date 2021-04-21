import AbstractView from './abstract.js';

const createTopRatedFilmsTemplate = () => {
  return (
    `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container films-list__top-rated">

      </div>
    </section>`
  );
};

export default class TopRatedFilms extends AbstractView {

  getTemplate() {
    return createTopRatedFilmsTemplate();
  }

}
