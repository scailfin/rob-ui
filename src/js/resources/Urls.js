/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

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
    /**
     * Shortcut to get the self reference link.
     */
    self() {
        return this.get('self');
    }
}
