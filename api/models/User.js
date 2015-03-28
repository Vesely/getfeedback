/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		email: {
			type: 'email',
			required: true
		}
	},
	
	// enroll: function (options, cb) {
	// 	User.findOne(options.id).exec(function (err, theUser) {
	// 	if (err) return cb(err);
	// 	if (!theUser) return cb(new Error('User not found.'));
	// 	theUser.enrolledIn.add(options.courses);
	// 	theUser.save(cb);
	// 	});
	// }
};

