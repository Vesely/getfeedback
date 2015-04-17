/**
 * FeedbackMessagesController
 *
 * @description :: Server-side logic for managing feedbackmessages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	messages: function(req, res) {
		res.view('messages');
	},
	/**
	 * `FeedbackMessagesController.addFeedbackMessage()`
	 *
	 * Add Design and upload file to the server's disk.
	 */
	addFeedbackMessage: function (req, res) {

		//Variables
		var content = req.param('content');
		var designId = req.param('designId');
		var feedbackId = req.param('feedbackId');

		FeedbackMessages.create({content: content, designId: designId, userId: 1, feedbackId : feedbackId}).exec(function(error, feedback) {
				if (error) {
					res.send(500, {error: "DB Error"});
				} else {
					// res.redirect( 'design/'+designId);
					res.json({
						status: 'ok'
					})
				}
			});


	},
};

