import {AvailabilityTracker} from './availability-tracker';

export class AvailabilityTrackerManager {

    private static instance: AvailabilityTrackerManager;
    private readonly trackers = new Map<string, AvailabilityTracker>();

    private constructor() {}

    public static getInstance(): AvailabilityTrackerManager {
        if (!AvailabilityTrackerManager.instance) {
            AvailabilityTrackerManager.instance = new AvailabilityTrackerManager();
        }

        return AvailabilityTrackerManager.instance;
    }

    public createTracker(region: string, sku: string): AvailabilityTracker {
        const trackerId = this.generateTrackerId(region, sku);
        if (!this.trackers.has(trackerId)) {
            this.trackers.set(trackerId, new AvailabilityTracker(trackerId, region, sku));
        }

        return this.trackers.get(trackerId);
    }

    public loadTracker(trackerId: string): AvailabilityTracker {
        if (!this.trackers.has(trackerId)) {
            throw new NoSuchTrackerFoundException("No tracker found with Id: " + trackerId);
        }

        return this.trackers.get(trackerId);
    }

    public loadTrackerByRegionAndSku(region: string, sku: string): AvailabilityTracker {
        return this.loadTracker(this.generateTrackerId(region, sku));
    }

    public deleteTracker(trackerId: string): void {
        if (!this.trackers.has(trackerId)) {
            throw new NoSuchTrackerFoundException("No tracker found with Id: " + trackerId);
        }

        this.trackers.get(trackerId).terminateTracker();
        this.trackers.delete(trackerId);
    }

    private generateTrackerId(region: string, sku: string): string {
        return region + '::' + sku;
    }
}

class NoSuchTrackerFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}
