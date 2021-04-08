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
import {createShowMoreButton} from './view/show-more-button';
import {createLoadingTemplate} from './view/films-list-title';
import {getMockArray} from './mock';
import {sorting} from './utils/common';
import {
  countList,
  placesList,
  sortingType,
  titleList
} from './const';

const mockData = getMockArray(countList.MOCK_COUNT);

const render = (container, template, place, countRender = countList.BASE_COUNT) => {
  let i = 0;
  while (i < countRender) {
    container.insertAdjacentHTML(place, template);
    i++;
  }
};


const renderFilms = (container, place, films = []) => {
  if(films.length > 0) {
    films.map((film) => container.insertAdjacentHTML(place, createFilmCardTemplate(film)));
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

if (mockData.length === 0) {
  render(siteFilmsUpcomingElement, createLoadingTemplate(titleList.EMPTY), placesList.BEFOREEND);
} else {
  renderFilms(siteFilmsUpcomingElement, placesList.BEFOREEND, mockData.slice(0, countList.FILM_COUNT));
  render(siteFilmsUpcomingElement, createShowMoreButton(), placesList.BEFOREEND);

  const buttonShowMoreElement = siteMainElement.querySelector('.films-list__show-more');

  if (mockData.length > countList.FILM_COUNT) {
    let renderedFilmsCount = countList.FILM_COUNT;

    buttonShowMoreElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      mockData
        .slice(renderedFilmsCount, renderedFilmsCount + countList.FILM_COUNT)
        .forEach((film) => render(buttonShowMoreElement, createFilmCardTemplate(film), placesList.BEFOREBEGIN));

      renderedFilmsCount += countList.FILM_COUNT;

      if (renderedFilmsCount >= mockData.length) {
        buttonShowMoreElement.remove();
      }
    });
  }

  render(siteFilmsElement, createTopRatedFilmsTemplate(), placesList.BEFOREEND);

  const siteFilmsTopRatedElement = siteMainElement.querySelector('.films-list__top-rated');
  renderFilms(siteFilmsTopRatedElement, placesList.BEFOREEND, sorting(mockData, sortingType.BY_RAITING).slice(0, countList.FILM_EXTRA_COUNT));

  render(siteFilmsElement, createMostCommentedFilmsTemplate(), placesList.BEFOREEND);

  const siteFilmsMostCommentedElement = siteMainElement.querySelector('.films-list__most-commented');
  renderFilms(siteFilmsMostCommentedElement, placesList.BEFOREEND, sorting(mockData, sortingType.BY_COMMENTING).slice(0, countList.FILM_EXTRA_COUNT));

  render(siteBodyElement, createFilmPopupTemplate(mockData[0]), placesList.BEFOREEND);

  const buttonClosePopupElement = document.querySelector('.film-details__close-btn');

  siteBodyElement.classList.add('hide-overflow');

  buttonClosePopupElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    closePopup();
  });

  const popupEscPressHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closePopup();
    }
  };

  document.addEventListener('keydown', popupEscPressHandler);

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
}

const siteFooterStatisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createFooterStatisticsTemplate(mockData.length), placesList.AFTEREND);

