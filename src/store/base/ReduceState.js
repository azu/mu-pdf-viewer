/**
 * ReduceState class is an abstraction class.
 * It provide redux like mechanism.
 * You should override `reduce(payload): ReduceState`.
 */
export default class ReduceState {

    /**
     * (domain) => state
     * receive domain model and return new state if needed
     * @abstract
     * @param {*} domain
     * @returns {ReduceState}
     */
    update(domain) {

    }

    /**
     * (payload) => state
     *
     * receive payload that is dispatched from UseCase and return new state if needed
     * @abstract
     * @param {DispatcherPayload} payload
     * @returns {ReduceState}
     */
    reduce(payload) {
        throw new Error("should implement `MyStore#reduce(payload)`");
    }

    /**
     * Compare `this` properties and `targetState` properties
     * If all properties is matched, return true.
     * @param {ReduceState} targetState
     * @returns {boolean}
     */
    equals(targetState) {
        if (this === targetState) {
            return true;
        }
        return Object.keys(this).every((key) => {
            return this[key] === targetState[key];
        });
    }

}
