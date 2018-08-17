const fs = require('fs');
const path = require('path');

function getTemplate(name) {
	return new Promise((resolve, reject) => {
		const filePath = path.join(path.dirname(require.main.filename), 'components', name, `${name}.html`);
		fs.readFile(filePath, 'utf8', (err, html) => {
			if (err) {
				return reject(err);
			}
			resolve(html);
		});
	});
}

module.exports = getTemplate;
