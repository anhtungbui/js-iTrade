const results = document.getElementById("chart-container");

export default class Search {
  searchWebService;
  constructor(searchWebService) {
    this.searchWebService = searchWebService;
  }
  async handleSearch(query) {
    if (!query) return;
    this.renderSearch(await this.searchWebService.getData(query));
    window.location.hash = "";
  }

  renderSearch(bestMatches) {
    results.innerHTML = "";
    bestMatches.forEach((stock) => {
      const markup = `<a href= #${stock["1. symbol"]} class = "list-group-item list-group-item-action bg-hover-gradient-blue" ><b>${stock["1. symbol"]}</b> ${stock["2. name"]} </a>`;

      results.insertAdjacentHTML("beforeend", markup);
    });
  }
}
