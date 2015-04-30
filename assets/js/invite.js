//Variables
var $inviteSection = $('.invite-section');
var $inviteBox = $('.invite-box');
var $inviteToggle = $('.invite-toggle');
var $inviteInput = $inviteBox.find('.form-control');
var $inviteBackdrop = $('.invite-backdrop');

//Functions
var showInviteBox = function() {
	$inviteBox.addClass('show');
	$inviteInput.focus();
	$inviteBackdrop.fadeIn(150);
};

var hideInviteBox = function() {
	$inviteBox.removeClass('show');
	$inviteBackdrop.fadeOut(100);
};


//show
$inviteToggle.on('click', showInviteBox);

//hide
$inviteBackdrop.on('click', hideInviteBox);

//Close invite box on press ESC
$(document).keyup(function(e) {
	// if (e.keyCode == 13)      // enter
	if (e.keyCode == 27) { //esc
		hideInviteBox();
	}
});
