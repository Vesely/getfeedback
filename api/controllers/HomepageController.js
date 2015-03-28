/**
 * HomepageController
 *
 * @description :: Server-side logic for managing Homepages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `HomepageController.index()`
   */
  index: function (req, res) {
    console.log('test');
    sails.log.info('Hello. It is works!!');
    return res.view('homepage', {
    	test: 'I am awesome! '
    });
    

    // return res.send("Hi there!");
    // return res.json({
    //   test: 'hi() is not implemented yet!'
    // });
  }
};

