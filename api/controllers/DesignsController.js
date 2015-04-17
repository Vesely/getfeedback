/**
 * DesignsController
 *
 * @description :: Server-side logic for managing designs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	renderDesign: function(req, res) {
		var id = req.param('id');


		

		// Designs.findOne(id).exec(function(err, design) {

		//   if (err || !design) {
		//     // return res.serverError(err);
		//     sails.log.info('Design neexistuje.');
		//     res.redirect('/');
		//   } else {
		//     sails.log.info(design);
		//   }

		//   this.closureFn = function () {
		//      return design;
		//   };
		// });

		// var design = closureFn();
		// //sails.log.info(design);
		
		Designs.findOne(id).exec(function(err, design){
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
						Feedbacks.find({designId: design.id}).exec(function(err, feedbacks){
							if (err) {
								// res.redirect('/');
								return res.view('design', {
									design: design,
									user: user
								});
							} else {
								// Feedbacks.subscribe(req.socket);
 	    						// Feedbacks.subscribe(req.socket, feedbacks);
								return res.view('design', {
									design: design,
									user: user,
									feedbacks: feedbacks
								});
							}
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

	/**
	 * `DesignsController.addFeedback()`
	 *
	 * Add Design and upload file to the server's disk.
	 */
	addFeedback: function (req, res) {

		//Variables
		var content = req.param('content');
		var designId = req.param('designId');
		var top = req.param('top');
		var left = req.param('left');

		var feedback = Feedbacks.create({content: content, designId: designId, userId: 1, top : top, left: left}).exec(function(error, feedback) {
				if (error) {
					res.send(500, {error: "DB Error"});
				} else {
					// res.redirect( 'design/'+designId);
					Feedbacks.publishCreate({id:feedback.id,content: content, designId: designId, userId: 1, top : top, left: left});
					res.json({
						status: 'ok'
					})
				}
			});


	},


};

