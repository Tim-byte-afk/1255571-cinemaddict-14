import dayjs from 'dayjs';
import Smart from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getRank, getWatchedCount, getRunTimeHours, getRunTimeMinutes, getTopGenre, getSortedFilms, getGenres, getGenreNumber} from '../utils/common';
import {StatisticsType} from '../const';

const BAR_HEIGHT = 50;

const renderChart = (statisticCtx, dataState) => {
  const films = getSortedFilms(dataState);

  statisticCtx.height = BAR_HEIGHT * getGenres(films).length;

  return  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: getGenres(films),
      datasets: [{
        data: getGenreNumber(films),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = (data) => {
  const currentFilter = data.currentFilter;
  const films = getSortedFilms(data);
  return (
    `<section class="statistic">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${getRank(data.films)}</span>
        </p>

        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" data-statistic-type = ${StatisticsType.ALL} ${currentFilter === StatisticsType.ALL ? 'checked' : ''}>
          <label for="statistic-all-time" class="statistic__filters-label">All time</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" data-statistic-type = ${StatisticsType.TODAY} ${currentFilter === StatisticsType.TODAY? 'checked' : ''}>
          <label for="statistic-today" class="statistic__filters-label">Today</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" data-statistic-type = ${StatisticsType.WEEK} ${currentFilter === StatisticsType.WEEK? 'checked' : ''}>
          <label for="statistic-week" class="statistic__filters-label">Week</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" data-statistic-type = ${StatisticsType.MONTH} ${currentFilter === StatisticsType.MONTH? 'checked' : ''}>
          <label for="statistic-month" class="statistic__filters-label">Month</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" data-statistic-type = ${StatisticsType.YEAR} ${currentFilter === StatisticsType.YEAR? 'checked' : ''}>
          <label for="statistic-year" class="statistic__filters-label">Year</label>
        </form>

        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">${getWatchedCount(films)} <span class="statistic__item-description">movies</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text">${getRunTimeHours(films)} <span class="statistic__item-description">h</span> ${getRunTimeMinutes(films)} <span class="statistic__item-description">m</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text">${getTopGenre(films)}</p>
          </li>
        </ul>

        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>

      </section>`
  );
};

export default class Statistics extends Smart {
  constructor(films) {
    super();

    this._data = {
      films,
      dateFrom: null,
      currentFilter: StatisticsType.ALL,
    };
    this._chart = null;

    this._statisticTypeClickHandler = this._statisticTypeClickHandler.bind(this);

    this._setCharts();
    this.setStatisticTypeClickHandler();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this.setStatisticTypeClickHandler();
    this._setCharts();
  }

  setStatisticTypeClickHandler() {
    this.getElement().querySelectorAll('.statistic__filters-input').forEach((element) => {
      element.addEventListener('change', this._statisticTypeClickHandler);
    });
  }

  destroy() {
    this.getElement().remove();
  }

  _setCharts() {
    if (this._data.films.length === 0) {
      this._chart = null;
      return;
    }
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    this._chart = renderChart(statisticCtx, this._data);
  }

  _statisticTypeClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.dataset.statisticType === this._data.currentFilter) {
      return;
    }

    switch (evt.target.dataset.statisticType) {
      case StatisticsType.ALL:
        this.updateData({
          dateFrom: null,
          currentFilter: StatisticsType.ALL,
        });
        break;
      case StatisticsType.TODAY:
        this.updateData({
          dateFrom: dayjs(),
          currentFilter: StatisticsType.TODAY,
        });
        break;
      case StatisticsType.WEEK:
        this.updateData({
          dateFrom: dayjs().subtract(7, 'day'),
          currentFilter: StatisticsType.WEEK,
        });
        break;
      case StatisticsType.MONTH:
        this.updateData({
          dateFrom: dayjs().subtract(1, 'month'),
          currentFilter: StatisticsType.MONTH,
        });
        break;
      case StatisticsType.YEAR:
        this.updateData({
          dateFrom: dayjs().subtract(1, 'year'),
          currentFilter: StatisticsType.YEAR,
        });
        break;
    }
  }

}
