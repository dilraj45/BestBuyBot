export class CheckoutManager {
    public checkout(region: string, sku: string) {
        chrome.tabs.create({
            url: `https://www.bestbuy.ca/en-ca/product/${sku}`,
        }, () => console.log("Auto fill checkout form details now."));
    }
}
