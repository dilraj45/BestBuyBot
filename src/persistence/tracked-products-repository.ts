export class TrackedProductsRepository {
    public static loadAllProducts(region: string, callback: ((skus: Array<string>) => void)): void {
        chrome.storage.local.get(['tracked_products'], result => {
            const trackedEntries = result?.tracked_products?.[region];
            callback(trackedEntries != undefined ? trackedEntries : []);
        });
    }

    public static appendProduct(region: string, sku: string): void {
        this.loadAllProducts(region, skus => {
            skus.push(sku);
            chrome.storage.local.set({'tracked_products': {[region]: skus}});
        });
    }

    public static removeProduct(region: string, sku: string): void {
        this.loadAllProducts(region, skus => {
            const index = skus.indexOf(sku);
            if (index > -1) {
                skus.splice(index, 1);
            }
            chrome.storage.local.set({'tracked_products': {[region]: skus}});
        });
    }
}
