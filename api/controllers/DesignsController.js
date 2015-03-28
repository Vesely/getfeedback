/**
 * DesignsController
 *
 * @description :: Server-side logic for managing designs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	renderDesign: function(req, res) {
		var id = req.param('id');
		
		Designs.findOne(id).exec(function(err, design){
			// return res.json({
			// 	id: id,
			// 	design: design
			// });
			if (err || !design) {
				// return res.serverError(err);
				sails.log.info('Design neexistuje.');
				res.redirect('/');
			} else {
				User.findOne(design.userId).exec(function(err, user){
					if (err) {
						// return res.serverError(err);
						sails.log.info('Uživatel neexistuje.');
						res.redirect('/');
					} else {
						return res.view('design', {
							design: design,
							user: user
						});
					}
				});
			}
		});
	},

	/**
	 * `DesignsController.uploadDesign()`
	 *
	 * upload file to the server's disk.
	 */
	uploadDesign: function (req, res) {

		res.setTimeout(0);

		req.file('design').upload({
			// You can apply a file upload limit (in bytes)
			// maxBytes: 1000000,
			//Set custom path
			dirname: require('path').resolve(sails.config.appPath, 'assets/uploads')
		// }, function whenDone(err, file) {
		}, function onUploadComplete(err, file) {
			if (err) {
				return res.serverError(err);
			} else {
				// If no files were uploaded, respond with an error.
				if (file.length === 0){
					return res.badRequest('No file was uploaded');
				}

				var file = file[0];
				
				var fileName = file.fd;
				var fileNameArray = fileName.split("/");
				var fileName = fileNameArray[fileNameArray.length - 1];

				return res.json({
					files: file,
					fileName: fileName
				});
			}
		});
	},

	/**
	 * `DesignsController.addEmailToDesign()`
	 *
	 * Add Design and upload file to the server's disk.
	 */
	addEmailToDesign: function (req, res) {

		//Variables
		var src = req.param("src");
		var email = req.param("email");
		
		//Find user by email, if not found, create him.
		User.findOrCreate({email: email}, {email: email}).exec(function(err, usr){
			if (err) {
				res.send(500, { error: "DB Error" });
			} else {
				if (usr) {
					Designs.create({src: src, userId: usr.id}).exec(function(error, design) {
						if (error) {
							res.send(500, {error: "DB Error"});
						} else {
							res.redirect( 'design/'+design.id);
						}
					});
				} else {
					sails.log.info('Nenašel jsem uživatele');
					res.redirect('/');
				}
				
			}
		});
	},
};

