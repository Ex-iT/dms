'use strict';

/**
 * Store data by key
 *
 * @param {String} key Key to store the data under
 * @param {Object} data The actual data
 */
function set(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Retrieve data by key
 *
 * @param {String} key
 * @returns {Object} Object with data
 */
function get(key) {
	return JSON.parse(localStorage.getItem(key));
}

module.exports = {set, get};
