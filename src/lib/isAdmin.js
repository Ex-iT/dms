module.exports = function isAdmin() {
	return new Promise((resolve, reject) => {
		try {
			const exec = require('child_process').exec;
			exec('NET SESSION', (err, so, se) => {
				resolve({
					isAdmin: (se.length === 0),
					error: false,
					description: ''
				});
			});
		} catch (error) {
			reject({ error: true, description: 'Unable to determine admin rights' });
		}
	})

};
