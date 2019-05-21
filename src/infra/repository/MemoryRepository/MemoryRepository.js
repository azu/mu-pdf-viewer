// LICENSE : MIT

const MapLike = require("map-like");
const assert = require("assert");
const EventEmitter = require("events");
const REPOSITORY_CHANGE = 'REPOSITORY_CHANGE';
/**
 * @template T
 * @constructor
 */
export default class MemoryRepository extends EventEmitter {
    /**
     * @param {T} DomainClass
     * @param {MapLike} database
     */
    constructor(DomainClass, database = new MapLike()) {
        super();

        this.DomainClass = DomainClass;
        this._database = database;

        /**
         * NOTE: if you apply magnification to code, the name is minified like `t`.
         * The MemoryRepository and (Aggregate)Domain is one-to-one by the design.
         * @type {string}
         */
        this._name = this.DomainClass.name;
    }

    /**
     * @param {*} id
     * @return {T}
     * @private
     */
    _get(id) {
        return this._database.get(`${this._name}.${id}`);
    }

    /**
     * Find domain by domain's `id`
     * @param {string} id
     * @returns {T}
     */
    findById(id) {
        return this._get(id);
    }

    /**
     * Return last used domain if it exist.
     * @returns {T|undefined}
     */
    lastUsed() {
        const item = this._database.get(`${this._name}.lastUsed`);
        if (!item) {
            return;
        }
        return this._get(item.id);
    }

    /**
     * Save domain and emit change.
     * @param {T} item
     */
    save(item) {
        assert(item instanceof this.DomainClass, `Save only ${this.DomainClass.name} instance`);
        this._database.set(`${this._name}.lastUsed`, item);
        this._database.set(`${this._name}.${item.id}`, item);
        this.emit(REPOSITORY_CHANGE, item);
    }

    /**
     * Remove domain from database
     * @param {string} id
     */
    remove(id) {
        this._database.delete(`${this._name}.${id}`);
        this.emit(REPOSITORY_CHANGE);
    }

    /**
     * add change handler
     * @param {function(domain: T)} handler
     */
    onChange(handler) {
        this.on(REPOSITORY_CHANGE, handler);
    }
};
