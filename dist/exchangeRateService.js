export class ExchangeRateService {
    getExchangeRate(fromCurrency, toCurrency, currentDate = new Date()) {
        const dateString = this.convertDateToString(currentDate);
        const conversionData = [
            {
                date: "2023-12-01",
                fromCurrency: "EUR",
                toCurrency: "HUF",
                rate: 382.15,
            },
            {
                date: "2023-12-01",
                fromCurrency: "USD",
                toCurrency: "HUF",
                rate: 351.27,
            },
            {
                date: "2023-12-02",
                fromCurrency: "EUR",
                toCurrency: "HUF",
                rate: 381.32,
            },
            {
                date: "2023-12-02",
                fromCurrency: "USD",
                toCurrency: "HUF",
                rate: 350.03,
            },
            {
                date: "2023-12-03",
                fromCurrency: "EUR",
                toCurrency: "HUF",
                rate: 383.07,
            },
            {
                date: "2023-12-03",
                fromCurrency: "USD",
                toCurrency: "HUF",
                rate: 352.12,
            },
            {
                date: "2023-12-04",
                fromCurrency: "EUR",
                toCurrency: "HUF",
                rate: "invalid rate",
            },
        ];
        // For 2023-12-04, for EUR the exchange rate is invalid, for USD it is missing
        // to help testing the error handling
        const conversionDataItem = this.findMatchingItem(conversionData, fromCurrency, toCurrency, dateString);
        if (conversionDataItem) {
            return conversionDataItem.rate;
        }
        else {
            const conversionDataItem = this.findMatchingItem(conversionData, toCurrency, fromCurrency, dateString);
            return this.getExchangeRateFromItem(conversionDataItem);
        }
    }
    getExchangeRateFromItem(item) {
        const exchangeRateIsNumber = item && typeof item.rate === "number";
        let result;
        if (exchangeRateIsNumber) {
            result = 1 / Number(item.rate);
        }
        else {
            result = "";
        }
        return result;
    }
    findMatchingItem(conversionData, fromCurrency, toCurrency, dateString) {
        return conversionData.find((item) => item.fromCurrency === fromCurrency &&
            item.toCurrency === toCurrency &&
            item.date === dateString);
    }
    convertDateToString(currentDate) {
        return currentDate.toISOString().split("T")[0];
    }
}
