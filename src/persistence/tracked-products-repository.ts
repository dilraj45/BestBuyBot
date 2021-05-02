export class TrackedProductsRepository {
    public static loadAllProducts(region: string, callback: ((skus: Array<string>) => void)): void {
        chrome.storage.local.get(['tracked-products'], result => {
            const trackedEntries = result['tracked-products'];
            callback(trackedEntries != undefined ? trackedEntries[region] : []);
        });
    }

    public static appendProduct(region: string, sku: string): void {
        this.loadAllProducts(region, skus => {
            skus.push(sku);
            chrome.storage.local.set({'tracked-products': {region: skus}});
        });
    }

    public static removeProduct(region: string, sku: string): void {
        this.loadAllProducts(region, skus => {
            const index = skus.indexOf(sku);
            if (index > -1) {
                skus.splice(index, 1);
            }
            chrome.storage.local.set({'tracked-products': {region: skus}});
        });
    }
}
