/**
* Designs.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    src : { 
    	type: 'string' 
    },
    userId : {
    	type: 'integer'
    }
  },
  getDesign: function (designId) {
		Designs.findOne(designId).exec(function (err, theDesign) {
		// if (err) return cb(err);
		// if (!theUser) return cb(new Error('Designs not found.'));
		if (!theDesign) return 'chyba';

		return theDesign;
		// theUser.enrolledIn.add(options.courses);
		// theUser.save(cb);
		});
	}
};

