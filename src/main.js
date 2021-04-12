import LogoView from './view/logo';
import MenuView from './view/menu';
import FilterView from './view/filter';
import FilmsBlockVew from './view/films-block';
import UpcomingFilmsView from './view/upcoming-films';
import TopRatedFilms from './view/top-rated-films';
import MostCommentedFilmsView from './view/most-commented-films';
import FilmCardView from './view/film-card';
import FooterStatisticsView from './view/footer-statistics';
import FilmPopupView from './view/film-popup';
import ShowMoreButtonView from './view/show-more-button';
import FilmsListTitleView from './view/films-list-title';
import {getMockArray} from './mock';
import {sorting, render} from './utils/common';
import {
  Variable,
  Places,
  SortingTypes,
  Titles
} from './const';

const mockData = getMockArray(Variable.MOCK_COUNT);

const closePopup = () => {
  removePopup();
  document.removeEventListener('keydown', popupEscPressHandler);
};

const removePopup = () => {
  const popup = document.querySelector('.film-details');
  if (popup) {
    siteBodyElement.classList.remove('hide-overflow');
    popup.remove();
  }
};

const popupEscPressHandler = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closePopup();
  }
};

const openPopup = (film) => {
  const filmPopupComponent = new FilmPopupView(film).getElement();
  render(siteBodyElement, filmPopupComponent, Places.BEFOREEND);
  filmPopupComponent.classList.remove('visually-hidden');
  siteBodyElement.classList.add('hide-overflow');

  const buttonClosePopupElement = document.querySelector('.film-details__close-btn');

  buttonClosePopupElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    closePopup();
  });

  document.addEventListener('keydown', popupEscPressHandler);
};

const renderFilms = (container, place, films) => {
  films.map((film) => {
    const filmCardComponent = new FilmCardView(film).getElement();
    render(container, filmCardComponent, place);
    const elementsPopupActive = filmCardComponent.querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments');
    elementsPopupActive.forEach((element) => {
      element.addEventListener('click', (evt) => {
        evt.preventDefault();
        openPopup(film);
      });
    });

  });
};

const siteBodyElement = document.querySelector('body');

const siteHeaderElement = siteBodyElement.querySelector('.header');
const LogoComponent = new LogoView();
render(siteHeaderElement, LogoComponent.getElement(), Places.BEFOREEND);

const siteMainElement = siteBodyElement.querySelector('.main');
render(siteMainElement, new MenuView(0, 0, mockData.length).getElement(), Places.BEFOREEND);
const filterComponent = new FilterView();
render(siteMainElement, filterComponent.getElement(), Places.BEFOREEND);

const filmsBlockComponent = new FilmsBlockVew();
render(siteMainElement, filmsBlockComponent.getElement(), Places.BEFOREEND);

const siteFilmsElement = siteMainElement.querySelector('.films');
const upcomingFilmsComponent = new UpcomingFilmsView();
render(siteFilmsElement, upcomingFilmsComponent.getElement(), Places.BEFOREEND);

const siteFilmsUpcomingElement = siteMainElement.querySelector('.films-list__upcoming');

if (mockData.length === 0) {
  render(siteFilmsUpcomingElement, new FilmsListTitleView(Titles.EMPTY).getElement(), Places.BEFOREEND);
} else {
  renderFilms(siteFilmsUpcomingElement, Places.BEFOREEND, mockData.slice(0, Variable.FILM_COUNT));
  const showMoreButtonComponent = new ShowMoreButtonView();
  render(siteFilmsUpcomingElement, showMoreButtonComponent.getElement(), Places.BEFOREEND);

  const buttonShowMoreElement = siteMainElement.querySelector('.films-list__show-more');

  if (mockData.length > Variable.FILM_COUNT) {
    let renderedFilmsCount = Variable.FILM_COUNT;

    buttonShowMoreElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      mockData
        .slice(renderedFilmsCount, renderedFilmsCount + Variable.FILM_COUNT)
        .forEach((film) => render(buttonShowMoreElement, new FilmCardView(film).getElement(), Places.BEFOREBEGIN));

      renderedFilmsCount += Variable.FILM_COUNT;

      if (renderedFilmsCount >= mockData.length) {
        buttonShowMoreElement.remove();
      }
    });
  }

  render(siteFilmsElement, new TopRatedFilms().getElement(), Places.BEFOREEND);

  const siteFilmsTopRatedElement = siteMainElement.querySelector('.films-list__top-rated');
  renderFilms(siteFilmsTopRatedElement, Places.BEFOREEND, sorting(mockData, SortingTypes.BY_RAITING).slice(0, Variable.FILM_EXTRA_COUNT));

  const mostCommentedFilmsComponent = new MostCommentedFilmsView();
  render(siteFilmsElement, mostCommentedFilmsComponent.getElement(), Places.BEFOREEND);

  const siteFilmsMostCommentedElement = siteMainElement.querySelector('.films-list__most-commented');
  renderFilms(siteFilmsMostCommentedElement, Places.BEFOREEND, sorting(mockData, SortingTypes.BY_COMMENTING).slice(0, Variable.FILM_EXTRA_COUNT));

  // render(siteBodyElement, new FilmPopupView(mockData[0]).getElement(), Places.BEFOREEND);

  // const buttonClosePopupElement = document.querySelector('.film-details__close-btn');

  // siteBodyElement.classList.add('hide-overflow');

  // buttonClosePopupElement.addEventListener('click', (evt) => {
  //   evt.preventDefault();
  //   closePopup();
  // });

  // const popupEscPressHandler = (evt) => {
  //   if (evt.key === 'Escape') {
  //     evt.preventDefault();
  //     closePopup();
  //   }
  // };

  // document.addEventListener('keydown', popupEscPressHandler);

  // const closePopup = () => {
  //   removePopup();
  //   document.removeEventListener('keydown', popupEscPressHandler);
  // };

  // const removePopup = () => {
  //   const popup = document.querySelector('.film-details');
  //   if (popup) {
  //     siteBodyElement.classList.remove('hide-overflow');
  //     popup.remove();
  //   }
  // };
}

const siteFooterStatisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new FooterStatisticsView(mockData.length).getElement(), Places.AFTEREND);
