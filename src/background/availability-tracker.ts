import {AvailabilityTrackerState, AvailabilityTrackerStates} from "./availability-tracker-states";

export class AvailabilityTracker {

    private readonly _trackerId: string;
    private readonly _sku: string;
    private readonly _region: string;
    private _state: AvailabilityTrackerState;

    private static readonly REGION_ENDPOINT_CONFIG = new Map<string, string>([
        [
            'CA', 'https://www.bestbuy.ca/ecomm-api/availability/products'
        ]
    ])

    private readonly sleep = (ms) => new Promise(res => setTimeout(res, ms));

    constructor(name: string, region: string, sku: string) {
        this._state = AvailabilityTrackerStates.WAITING;
        this._sku = sku;
        this._region = region;
        this._trackerId = name;
    }

    public get trackerId(): string {
        return this._trackerId;
    }

    public get state(): AvailabilityTrackerState {
        return this._state;
    }

    public get sku(): string {
        return this._sku;
    }

    public get region(): string {
        return this._region;
    }

    public async isProductAvailableOnlinePurchase(): Promise<boolean> {
        // todo Dilraj: Make the code generic for other bestbuy regions as well.
        const response = await fetch(`https://www.bestbuy.ca/ecomm-api/availability/products?sku=${this._sku}`)
            .then(response => response.json());
        return response['availabilities'][0]['shipping']['purchasable'];
    }

    public async trackUntilAvailable() {
        console.log(`Attempting to start tracker: ${this._trackerId}`);
        this.transitionToState(AvailabilityTrackerStates.RUNNING);
        while (this._state === AvailabilityTrackerStates.RUNNING) {
            // Adding random jitter.
            await this.sleep(Math.random() * 5000);
            if (await this.isProductAvailableOnlinePurchase()) {
                this.transitionToState(AvailabilityTrackerStates.WAITING);
                console.log('Product availability status has changed');
                return;
            }
        }
        throw new Error("Tracker interrupted while running");
    }

    public suspendTracker(): void {
        console.log(`Attempting to suspend tracker: ${this._trackerId}`);
        this.transitionToState(AvailabilityTrackerStates.WAITING);
    }

    public terminateTracker(): void {
        console.log(`Attempting to terminate tracker: ${this._trackerId}`);
        this.transitionToState(AvailabilityTrackerStates.TERMINATED);
    }

    private transitionToState(state: AvailabilityTrackerState): void {
        if (!this._state.getPermissibleStates().includes(state)) {
            throw new Error(`Transitioning tracker from ${this._state.stateName()} to ${state.stateName()}
             is not allowed`);
        }
        this._state = state;
    }
}
