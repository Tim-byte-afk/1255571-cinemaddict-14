import LogoView from './view/logo';
import MenuView from './view/menu';
import Board from './presenter/board';
import FooterStatisticsView from './view/footer-statistics';
import {getMockArray} from './mock';
import {render} from './utils/render';
import {
  Variable,
  Places
} from './const';

const mockData = getMockArray(Variable.MOCK_COUNT);

const siteBodyElement = document.querySelector('body');

const siteHeaderElement = siteBodyElement.querySelector('.header');
const LogoComponent = new LogoView();
render(siteHeaderElement, LogoComponent, Places.BEFOREEND);

const siteMainElement = siteBodyElement.querySelector('.main');
render(siteMainElement, new MenuView(0, 0, mockData.length), Places.BEFOREEND);

const presenter = new Board(siteBodyElement, siteMainElement);
presenter.init(mockData);

const siteFooterStatisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new FooterStatisticsView(mockData.length), Places.BEFOREEND);
