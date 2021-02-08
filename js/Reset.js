export default class Reset {
  constructor(portfolio) {
    this.portfolio = portfolio;
  }
  resetLocalstorage() {
    localStorage.clear();
    this.portfolio.initPortfolio();
    location.reload();
  }
}
