// class to include in the portfolio
export class Portfolio {
  cash = 1000000;
  stocks = [];
  buyValue = Number;
  sellValue = Number;
  stockService;

  constructor(stockWebService) {
    this.stockWebService = stockWebService;
    try {
      if (localStorage.getItem("myPortfolio")) {
        this.stocks = JSON.parse(localStorage.getItem("myPortfolio"));
      } else {
        this.stocks = [];
      }
    } catch (e) {
      this.stocks = [];
    }
    this.initPortfolio();
  }

  retrieveCash() {
    return Number(localStorage.getItem("cash"));
  }

  setCash(cash) {
    return localStorage.setItem("cash", cash);
  }

  computeQuantity() {
    const quantities = {};
    this.stocks = JSON.parse(localStorage.getItem("myPortfolio"));
    this.stocks.forEach(([symbol, { buyPrice, quantity }], index) => {
      if (quantities[symbol]) {
        quantities[symbol] += parseInt(quantity);
      } else {
        quantities[symbol] = parseInt(quantity);
      }
    });
    return quantities;
  }

  addToPortfolio(symbol, buyPrice, quantity) {
    //write all the 3 values in local storage
    this.stocks.push([symbol, { buyPrice, quantity }]);
    localStorage.setItem("myPortfolio", JSON.stringify(this.stocks));
  }

  async computePortfValue() {
    let portfolioValue = this.retrieveCash();
    const portfQuantity = this.computeQuantity();
    const symbols = Object.keys(portfQuantity);

    const promises = symbols.map(async (symbol) => {
      const currentPrice = await this.getCurrentPrice(symbol);
      portfolioValue += portfQuantity[symbol] * currentPrice;
    });

    await Promise.all(promises);

    localStorage.setItem("PortFolioValue", portfolioValue);
    return portfolioValue;
  }

  async executeBuy(symbol, quantity) {
    const buyPrice = await this.getCurrentPrice(symbol);
    this.buyValue = buyPrice * quantity;
    let cash = this.retrieveCash();
    if (this.buyValue < cash && quantity > 0) {
      alert("Buy order executed successfully");
      this.addToPortfolio(symbol, buyPrice, quantity);
      cash = cash - this.buyValue;
      this.setCash(cash);
    } else {
      alert(
        "Insufficient balance to execute Buy order or please enter a right quantity"
      );
    }
    await this.computePortfValue();
  }

  async executeSell(symbol, quantity) {
    const sellPrice = await this.getCurrentPrice(symbol);
    this.sellValue = sellPrice * quantity;
    let cash = JSON.parse(this.retrieveCash());
    const portfQuantity = this.computeQuantity();
    if (quantity <= portfQuantity[symbol]) {
      alert("Sell order executed successfully");
      this.addToPortfolio(symbol, sellPrice, quantity * -1);
      cash = cash + this.sellValue;
      this.setCash(cash);
    } else {
      alert("Insufficient quantity to execute Sell order");
    }
    await this.computePortfValue();
  }

  getCurrentPrice(symbol) {
    return this.stockWebService.getData(symbol).then((data) => {
      return data["marketPrice"];
    });
  }

  initPortfolio() {
    if (!localStorage.myPortfolio) {
      localStorage.setItem("myPortfolio", "[]");
    }

    if (!localStorage.cash) {
      localStorage.setItem("cash", 1000000);
    }
  }
}
