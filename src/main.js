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

const api = new Api(END_POINT, AUTHORIZATION);

const siteBodyElement = document.querySelector('body');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteMainElement = siteBodyElement.querySelector('.main');

const filmsModel = new FilmsModel();

const filterModel = new FilterModel();

const presenter = new Board(siteBodyElement, siteMainElement, filmsModel, filterModel, siteHeaderElement, api);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

let statisticComponent = null;

filterPresenter.init();
presenter.init();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILTER:
      if (statisticComponent !== null) {
        statisticComponent.hide();
      }
      presenter.show();
      break;
    case MenuItem.STATISTICS:
      statisticComponent = new StatisticsView(filmsModel.get());
      render(siteMainElement, statisticComponent, Places.BEFOREEND);
      presenter.hide();
      statisticComponent.show();
      break;
  }
};

const siteFooterStatisticsElement = siteBodyElement.querySelector('.footer__statistics');

api.getFilms()
  .then((films) => {
    filmsModel.set(UpdateType.INIT, films);
    render(siteFooterStatisticsElement, new FooterStatisticsView(films.length), Places.BEFOREEND);
    filterPresenter.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    filmsModel.set(UpdateType.INIT, []);
    render(siteFooterStatisticsElement, new FooterStatisticsView([].length), Places.BEFOREEND);
    filterPresenter.setMenuClickHandler(handleSiteMenuClick);
  });


window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
