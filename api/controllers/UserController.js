/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	/**
	 * `UserController.findOrCreateUser()`
	 *
	 * Add Design and upload file to the server's disk.
	 */
	findOrCreateUser: function (req, res) {

		//Variables
		var email = req.param("email");
		
		//Find user by email, if not found, create him.
		User.findOrCreate({email: email}, {email: email}).exec(function(err, usr){
			if (err) {
				res.send(500, { error: "DB Error" });
			} else {
				if (usr) {
					res.json(usr);
				} else {
					sails.log.info('Nenašel jsem uživatele');
					res.redirect('/');
				}
				
			}
		});
	},
};

