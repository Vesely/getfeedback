/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	 * `FileController.upload()`
	 *
	 * Upload file(s) to the server's disk.
	 */
	upload: function (req, res) {

		// e.g.
		// 0 => infinite
		// 240000 => 4 minutes (240,000 miliseconds)
		// etc.
		//
		// Node defaults to 2 minutes.
		res.setTimeout(0);

		req.file('design').upload({
			// You can apply a file upload limit (in bytes)
			maxBytes: 1000000,
			//Set custom path
			dirname: require('path').resolve(sails.config.appPath, '/assets/uploads')
		}, function whenDone(err, uploadedFiles) {
			if (err) {
				return res.serverError(err);
			} else {
				// If no files were uploaded, respond with an error.
			if (uploadedFiles.length === 0){
				return res.badRequest('No file was uploaded');
			}
				// return res.json({
				// 	files: uploadedFiles,
				// 	textParams: req.params.all()
				// });

				var email = req.param("email");
				
				
				User.find().where({email: email}).exec(function(err, usr){
					if (err) {
						res.send(500, { error: "DB Error" });
					} else if (usr) {
						// res.send(400, {error: "Email already Taken"});
						//User exist
						req.session.user = usr;
						var user = usr;
						// res.send(usr);
					} else {
						User.create({email: email}).done(function(error, user) {
							if (error) {
								res.send(500, {error: "DB Error"});
							} else {
								req.session.user = user;
								var user = user;
							}
						});
					}
				});
    			sails.log.info(req.session.user);
				res.send(req.session.user);
			}
		});
	},

	/**
	 * FileController.download()
	 *
	 * Download a file from the server's disk.
	 */
	download: function (req, res) {
		require('fs').createReadStream(req.param('path'))
		.on('error', function (err) {
			return res.serverError(err);
		})
		.pipe(res);
	}
};

