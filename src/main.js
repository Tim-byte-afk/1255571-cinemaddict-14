import {createLogoTemplate} from './view/logo';
import {createMenuTemplate} from './view/menu';
import {createFilterTemplate} from './view/filter';
import {createFilmsBlockTemplate} from './view/films-block';
import {createUpcomingFilmsTemplate} from './view/upcoming-films';
import {createTopRatedFilmsTemplate} from './view/top-rated-films';
import {createMostCommentedFilmsTemplate} from './view/most-commented-films';
import {createFilmCardTemplate} from './view/film-card';
import {createFooterStatisticsTemplate} from './view/footer-statistics';
import {createFilmPopupTemplate} from './view/film-popup';
import {
  countList,
  placesList
} from './const';


const render = (container, template, place, countRender = countList.BASE_COUNT) => {
  let i = 0;
  while (i < countRender) {
    container.insertAdjacentHTML(place, template);
    i++;
  }
};

const siteBodyElement = document.querySelector('body');

const siteHeaderElement = siteBodyElement.querySelector('.header');
render(siteHeaderElement, createLogoTemplate(), placesList.BEFOREEND);

const siteMainElement = siteBodyElement.querySelector('.main');
render(siteMainElement, createMenuTemplate(), placesList.BEFOREEND);
render(siteMainElement, createFilterTemplate(), placesList.BEFOREEND);
render(siteMainElement, createFilmsBlockTemplate(), placesList.BEFOREEND);

const siteFilmsElement = siteMainElement.querySelector('.films');
render(siteFilmsElement, createUpcomingFilmsTemplate(), placesList.BEFOREEND);

const siteFilmsUpcomingElement = siteMainElement.querySelector('.films-list__upcoming');
render(siteFilmsUpcomingElement, createFilmCardTemplate(), placesList.BEFOREEND, countList.FILM_COUNT);

render(siteFilmsElement, createTopRatedFilmsTemplate(), placesList.BEFOREEND);

const siteFilmsTopRatedElement = siteMainElement.querySelector('.films-list__top-rated');
render(siteFilmsTopRatedElement, createFilmCardTemplate(), placesList.BEFOREEND, countList.FILM_EXTRA_COUNT);

render(siteFilmsElement, createMostCommentedFilmsTemplate(), placesList.BEFOREEND);

const siteFilmsMostCommentedElement = siteMainElement.querySelector('.films-list__most-commented');
render(siteFilmsMostCommentedElement, createFilmCardTemplate(), placesList.BEFOREEND, countList.FILM_EXTRA_COUNT);


const siteFooterStatisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createFooterStatisticsTemplate(), placesList.AFTEREND);

render(siteBodyElement, createFilmPopupTemplate(), placesList.BEFOREEND);
