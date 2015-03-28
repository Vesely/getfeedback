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
			User.findOne(design.userId).exec(function(err, user){
				return res.view('design', {
					design: design,
					user: user
				});
			});
		});
	},

	/**
	 * `DesignsController.addDesign()`
	 *
	 * Add Design and upload file to the server's disk.
	 */
	addDesign: function (req, res) {

		res.setTimeout(0);

		req.file('design').upload({
			// You can apply a file upload limit (in bytes)
			maxBytes: 1000000,
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

			// return res.json({
			// 	files: file,
			// 	fileName: file.filename,
			// 	textParams: req.params.all()
			// });

			var file = file[0];
			
			var fileName = file.fd;
			var fileNameArray = fileName.split("/");
			var fileName = fileNameArray[fileNameArray.length - 1];

			Designs.create({src: fileName, userId: 1}).exec(function(error, design) {
				if (error) {
					res.send(500, {error: "DB Error"});
				} else {
					res.redirect( 'design/'+design.id);
				}
				// sails.log.info(user);
			});


			// var email = req.param("email");
			
			
			// User.find().where({email: email}).exec(function(err, usr){
			// 	if (err) {
			// 		res.send(500, { error: "DB Error" });
			// 	} else if (usr) {
			// 		// res.send(400, {error: "Email already Taken"});
			// 		//User exist
			// 		req.session.user = usr;
			// 		var user = usr;
			// 	} else {
			// 		User.create({email: email}).done(function(error, user) {
			// 			if (error) {
			// 				res.send(500, {error: "DB Error"});
			// 			} else {
			// 				req.session.user = user;
			// 				var user = user;
			// 			}
					// sails.log.info(user);

			// 		});
			// 	}
			// 	res.send(user);
			// });
 			//sails.log.info(req.session.user);
			// res.send(req.session.user);
			}
		});
	},
};

