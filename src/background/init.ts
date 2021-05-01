import {AvailabilityTrackerManager} from "./availability-tracker-manager";

console.log("Bootstrapping background application");

chrome.runtime.onInstalled.addListener(() => {
    console.log("Welcome to BestBuyBot user community. Hope you'll enjoy this.")
});

function bootstrapTracker(region: string, sku: string) {
    let manager = AvailabilityTrackerManager.getInstance();
    manager.createTracker(region, sku).trackUntilAvailable()
        .then(() => {
            // todo Dilraj: Define checkout actions.
            console.log("Take checkout actions")
        });
}

chrome.storage.local.get(['tracked-products'], result => {
    const trackedEntries = result['tracked-products'];
    const res = trackedEntries != undefined ? trackedEntries['CA'] : [];
    for (let sku of res) {
        try {
            bootstrapTracker('CA', sku);
        } catch (error) {
            console.error(`Failed to create tracker for sku: ${sku}`, error);
        }
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log("Changes detected to storage");
    if (namespace !== "local") return;
    const manager = AvailabilityTrackerManager.getInstance();
    console.log("Namespace is local, processing changes");
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key !== 'tracked-products') {
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
