export abstract class AvailabilityTrackerState {
    public abstract stateName(): string;
    public abstract getPermissibleStates(): Array<AvailabilityTrackerState>;
}

class WAITING extends AvailabilityTrackerState {
    public getPermissibleStates(): Array<AvailabilityTrackerState> {
        return [AvailabilityTrackerStates.RUNNING, AvailabilityTrackerStates.WAITING];
    }

    public stateName(): string {
        return "WAITING";
    }
}

class TERMINATED extends AvailabilityTrackerState {
    public getPermissibleStates(): Array<AvailabilityTrackerState> {
        return [AvailabilityTrackerStates.TERMINATED];
    }

    public stateName(): string {
        return "TERMINATED";
    }
}

class RUNNING extends AvailabilityTrackerState {
    public getPermissibleStates(): Array<AvailabilityTrackerState> {
        return [AvailabilityTrackerStates.RUNNING, AvailabilityTrackerStates.WAITING,
            AvailabilityTrackerStates.TERMINATED];
    }

    public stateName(): string {
        return "RUNNING";
    }
}

export class AvailabilityTrackerStates {
    public static readonly RUNNING: AvailabilityTrackerState = new RUNNING();
    public static readonly WAITING: AvailabilityTrackerState = new WAITING();
    public static readonly TERMINATED: AvailabilityTrackerState = new TERMINATED();
}
