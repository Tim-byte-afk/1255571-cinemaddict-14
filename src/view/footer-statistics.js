import AbstractView from './abstract.js';

const createFooterStatisticsTemplate = (moviesCount) => {
  return (
    `<p>${moviesCount} movies inside</p>`
  );
};

export default class FooterStatistics extends AbstractView {
  constructor(moviesCount) {
    super();
    this.moviesCount = moviesCount;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this.moviesCount);
  }

}
