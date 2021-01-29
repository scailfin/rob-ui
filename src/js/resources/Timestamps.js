/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019-2021 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

var moment = require('moment-timezone');


export const utc2LocalTime = (timestamp) => {
    const localDate = moment.tz(timestamp, "UTC");
    return localDate.tz(moment.tz.guess()).format('DD-MMM-YYYY HH:mm:ss');
}
