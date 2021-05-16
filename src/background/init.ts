import {AvailabilityTrackerManager} from "./availability-tracker-manager";
import {CheckoutManager} from "./checkout-manager";
import {TrackedProductsRepository} from "../persistence/tracked-products-repository";

console.log("Bootstrapping background application");

chrome.runtime.onInstalled.addListener(() => {
    console.log("Welcome to BestBuyBot user community. Hope you'll enjoy this.")
});

function bootstrapTracker(region: string, sku: string) {
    let trackerManager = AvailabilityTrackerManager.getInstance();
    let checkoutManager = new CheckoutManager();
    trackerManager.createTracker(region, sku).trackUntilAvailable()
        .then(() => {
            TrackedProductsRepository.removeProduct(region, sku);
            checkoutManager.checkout(region, sku);
        });
}

chrome.storage.local.get(['tracked_products'], result => {
    
    const trackedEntries = result?.tracked_products?.CA;
    const res = trackedEntries != undefined ? trackedEntries : [];
    for (let sku of res) {
        try {
            bootstrapTracker('CA', sku);
        } catch (error) {
            console.error(`Failed to create tracker for sku: ${sku}`, error);
        }
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace !== "local") return;
    const manager = AvailabilityTrackerManager.getInstance();
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key !== 'tracked_products') {
            continue;
        }

        let oldSku = new Set<string>(oldValue['CA']);
        let newSku = new Set<string>(newValue['CA']);

        oldSku.forEach(x => {
            if (newSku.has(x)) return;
            let tracker = manager.loadTrackerByRegionAndSku('CA', x);
            manager.deleteTracker(tracker.trackerId);
        });

        newSku.forEach(x => {
            if (oldSku.has(x)) return;
            bootstrapTracker('CA', x);
        });
    }
});
