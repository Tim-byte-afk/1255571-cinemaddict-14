import Board from './presenter/board';
import FooterStatisticsView from './view/footer-statistics';
import FilterPresenter from './presenter/filter.js';
import {render} from './utils/render';
import {
  Places,
  MenuItem,
  UpdateType
} from './const';
import Api from './api.js';
import FilmsModel from './model/films';
import FilterModel from './model/filter.js';
import StatisticsView from './view/statistics.js';

const AUTHORIZATION = 'Basic Hsk3svvnt84';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict/';

const siteBodyElement = document.querySelector('body');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteFooterStatisticsElement = siteBodyElement.querySelector('.footer__statistics');

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILTER:
      if (statisticComponent !== null) {
        statisticComponent.destroy();
      }
      presenter.show();
      break;
    case MenuItem.STATISTICS:
      statisticComponent = new StatisticsView(filmsModel.get());
      render(siteMainElement, statisticComponent, Places.BEFOREEND);
      presenter.hide();
      break;
  }
};

const setFilms = (films) => {
  filmsModel.set(UpdateType.INIT, films);
  render(siteFooterStatisticsElement, new FooterStatisticsView(films.length), Places.BEFOREEND);
  filterPresenter.setMenuClickHandler(handleSiteMenuClick);
};

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();

const filterModel = new FilterModel();

const presenter = new Board(siteBodyElement, siteMainElement, filmsModel, filterModel, siteHeaderElement, api);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

let statisticComponent = null;

filterPresenter.init();
presenter.init();

api.getFilms()
  .then((films) => {
    setFilms(films);
  })
  .catch(() => {
    setFilms([]);
  });


window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
