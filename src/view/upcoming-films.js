import AbstractView from './abstract.js';

const createUpcomingFilmsTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container films-list__upcoming">

      </div>
    </section>`
  );
};

export default class UpcomingFilms extends AbstractView {

  getTemplate() {
    return createUpcomingFilmsTemplate();
  }

}
