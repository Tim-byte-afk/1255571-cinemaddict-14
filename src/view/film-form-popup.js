import AbstractView from './abstract.js';

const createFilmsFormTemplate = () => {
  return (
    `<section class="film-details visually-hidden">
      <form class="film-details__inner" action="" method="get">

      </form>
    </section>`
  );
};

export default class FilmsFormPopup extends AbstractView {

  getTemplate() {
    return createFilmsFormTemplate();
  }

  setPopupOpen(siteBodyElement) {
    this.getElement().classList.remove('visually-hidden');

    siteBodyElement.classList.add('hide-overflow');
  }

  setPopupClose(siteBodyElement) {
    siteBodyElement.classList.remove('hide-overflow');
  }

}
