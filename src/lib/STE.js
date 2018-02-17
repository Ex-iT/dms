'use strict'

/**
 * Simple Template Engine
 * Over simplified template engine
 *
 * @param {String} template HTML string
 * @param {Objecy} context The data for the template
 * @returns {String} A string with the parsed HTML
 */
function sTE(template, context) {
	// Replace
	const hits = template.match(/{{(.+?)}}/gi);
	if (hits) {
		hits.forEach(hit => {
			const key = hit.match(/{{(.+?)}}/i, '')[1].trim();
			if (context.hasOwnProperty(key)) {
				template = template.replace(hit, context[key]);
			} else {
				console.warn(`Key '${key}' not found in context`);
			}
		});
	}

	// Conditionals
	const conHits = template.match(/{%\sif\s(.+?)\s%}(.+?){%\sendif\s%}/gi);
	if (conHits) {
		conHits.forEach(hit => {
			const match = template.match(/{%\sif\s(.+?)\s%}(.+?){%\sendif\s%}/i);
			if (context.hasOwnProperty(match[1])) {
				// Positive match
				if (context[match[1]]) {
					template = template.replace(hit, match[2]);
				} else {
					template = template.replace(hit, '');
				}
			} else {
				// Negative match
				if (match[1].startsWith('!')) {
					const key = match[1].replace('!', '');
					if (context.hasOwnProperty(key)) {
						if (!context[key]) {
							template = template.replace(hit, match[2]);
						} else {
							template = template.replace(hit, '');
						}
					}
				} else {
					console.warn(`Conditional '${match[1]}' not found in context`);
				}
			}
		});
	}

	return template;
}

module.exports = sTE;
