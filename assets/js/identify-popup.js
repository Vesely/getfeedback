//IdentifyPopup - created by David Veselý
var IdentifyPopup = function(debugMode)
{
	if (debugMode && debugMode === true) { this.debugMode = true; }

	// this.log('starting');
	this.register();
};

IdentifyPopup.prototype = {
	debugMode: true,

	register: function()
	{
		this.log('registering');
		var self = this;

		//Create backdrop
		$('body').append('<div class="identify-backdrop" style="display:none"></div>');
		
		//variables
		this.popup = $('.identify-popup');
		this.backdrop = $('.identify-backdrop');
		this.input = this.popup.find('.form-control');

	},

	show: function(feedbackId)
	{
		this.log('showing');
		this.popup.data('feedbackid', feedbackId);

		this.backdrop.fadeIn(300);
		this.popup.fadeIn(300);
		this.input.focus();
	},

	close: function()
	{
		this.log('closing');
		this.popup.fadeOut(300);
		this.backdrop.fadeOut(300);
	},

	log: function()
	{
		if (this.debugMode) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift('Popup:');
			console.log.apply(console, args);
		}
	}
};