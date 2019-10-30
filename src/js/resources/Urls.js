export class Urls {
    constructor(links) {
        this.links = links;
    }
    /**
     * Get the HTTP reference that is associated with the given relationship
     * key. The result is null if no reference with the given key exists.
     */
    get(key) {
        const ref = this.links.find((ref) => (ref.rel === key));
        if (ref != null) {
            return ref.href;
        } else {
            return null;
        }
    }
}
