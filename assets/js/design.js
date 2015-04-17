//Design page


var designId = $('.design').data('id');
// io.socket.request('/api/feedbacks');

// Hide all feedback boxes (so useful comment, i know it :D)
var hideAllFeedbackBoxes = function () {
	$('.feedback-box').addClass('hidden');
}

//Rerun jquery functions
var rebuildFeedbackActions = function() {
	//Open feedbackbox
	$('.feedback .point').on('click', function(){
		hideAllFeedbackBoxes();
		var $feedback = $(this).parents('.feedback').first();
		var $feedbackBox = $feedback.find('.feedback-box');

		$feedbackBox.toggleClass('hidden');
		console.log('clicked');
		return false;	
	});

	// On focus small input => large it
	$('.feedback-box .form-control').on('focus', function(){
		var $form = $(this).parents('.form').first();
		var isSmall = $form.hasClass('.form-small');

		if (!isSmall) {
			$form.removeClass('form-small');
		}
	}).on('blur', function() {
		var $form = $(this).parents('.form').first();
		var isSmall = $form.hasClass('.form-small');
		var value = $(this).val();

		if (!isSmall && !value) {
			$form.addClass('form-small');
		}
	});

	//Add feedback message
	$('.feedback .form-msg .btn').on('click', function(){
		console.log('chci přidat zpravu');
		//Variables
		var $form = $(this).parents('.form').first();
		var $contentInput = $form.find('.form-control');
		var content = $contentInput.val();
		// var designId = $form.data('designid');
		var feedbackId = $form.data('feedbackid');

		//Send the message
		console.log('Odesílám odpověď do feedbacku');

		//Create it
		io.socket.post('/api/feedbackMessages/create', {content: content, designId: designId, feedbackId: feedbackId}, function (response) {
			console.log(response);
			$contentInput.val('');
			renderFeedbackMessages();
		});
		return false;
	});
}

// var getUser = function(id) {

// 	io.socket.get('/api/user?id='+id, function (user) {
// 		// console.log(user);
// 		return user;
// 	});

// 	return user;
// }

// console.log(getUser(1));

//Load messages
var renderFeedbackMessages = function() {
	var $feedbacks = $('.renderFeedbacks .feedback');
	$('.other-messages').html('');

	$feedbacks.each(function(index){
		var $feedback = $(this);
		var feedbackId = $feedback.data('id');
		var $otherMessages = $feedback.find('.other-messages');

		// console.log(feedbackId);

		io.socket.get('/api/feedbackMessages?feedbackId='+feedbackId, function (messages) {
			for (var i = 0; i < messages.length; i++) {
				var msg = messages[i];
				console.log(msg);
				$otherMessages.append('<div class="message"><p>'+msg.content+'</p></div>');
			};
		});
		
	});
}

// Load feedbacks
var renderFeedbacks = function () {
	var $renderFeedbacks = $('.renderFeedbacks');
	$renderFeedbacks.html('');
	
	io.socket.get('/api/feedbacks?designId='+designId, function (feedbacks) {
		// console.log(feedbacks);
		for (var i = 0; i < feedbacks.length; i++) {
			var fdb = feedbacks[i];
			$renderFeedbacks.append(
				'<div class="feedback feedback-exist" data-id="'+fdb.id+'" style="top: '+fdb.top+'px; left: '+fdb.left+'px">' + 
					'<span class="point">'+(i+1)+'</span>' +
					'<div class="feedback-box hidden">' +
						'<div class="feedback-messages">' +
							'<div class="message">' +
								'<p>'+fdb.content+'</p>' +
								'<span class="badge">'+
									'userId: <%= feedback.userId %>'+
								'</span>'+
							'</div>'+
							'<div class="other-messages">' +
							'</div>' +
						'</div>'+
						'<form class="form form-msg form-small1" data-feedbackid="'+fdb.id+'">'+
							'<textarea class="form-control" placeholder="Write a comment…"></textarea>'+
							'<button type="submit" class="btn">' +
								'<span>Send it</span>'+
								'<img src="/img/arrow-right.svg" alt="Arrow right">' +
							'</button>' +
						'</form>' +
					'</div>' +
				'</div>'
			);
		}
		renderFeedbackMessages();
		rebuildFeedbackActions();
	});

};
renderFeedbacks();

io.socket.on("feedbacks", function(event){
	console.log('Změna ve "feedbacks"');
	renderFeedbacks();
});

io.socket.on("feedbackMessages", function(event){
	console.log('Změna ve "feedbackMessages"');
	// renderFeedbackMessages();
	renderFeedbacks();
});

//Add feedback point
var $feedbackAdd = $('.feedback-add');
var $feedbackAddForm = $feedbackAdd.find('.form');

$('.design .image').on('click', function(){
	hideAllFeedbackBoxes();
	$feedbackAdd.find('.feedback-box').removeClass('hidden');
	
	//Offsets
	var designLeftOffset = $(this).offset().left, //x
		designTopOffset = $(this).offset().top; //y
	
	//Clicked position (on full page)
	var top = event.pageY;
	var left = event.pageX;

	//Clicked position only in design box
	var topInBox = (event.pageY - designTopOffset);
	var leftInBox = (event.pageX - designLeftOffset);

	//Create point
	$feedbackAdd.css({
			top: topInBox,
			left: leftInBox,
			display: 'block'
		});

	//Add datta attribudes with postion
	$feedbackAddForm.attr('data-top', topInBox).attr('data-left', leftInBox);

	//Focus the input
	$feedbackAddForm.find('.form-control').focus();
	
	return false;
});

//Create and send feedback
$('.feedback-add .form .btn').on('click', function(){
	//Variables
	var $form = $('.feedback-add .form');
	var $contentInput = $form.find('.form-control');
	var content = $contentInput.val();
	var designId = $form.find('.design-id').val();
	var top = $form.data('top');
	var left = $form.data('left');


	console.log('Odesílám feedback');
	// $.ajax({
 //        url: '/api/designs/addFeedback',
 //        data: {content: content, designId: designId, top: top, left: left},
 //        success: function (response) {
 //            console.log(response);
 //            hideAllFeedbackBoxes();
 //        }
 //    })
	//{content: content, designId: designId, userId: 1, top : top, left: left}
	// io.socket.post('/api/designs/addFeedback', {content: content, designId: designId, userId: 1, top: top, left: left}, function (response) {
	io.socket.post('/api/feedbacks/create', {content: content, designId: designId, userId: 1, top: top, left: left}, function (response) {
        console.log(response);
        hideAllFeedbackBoxes();
    	renderFeedbacks();
    });

	$contentInput.val('');

	return false;
});

//Close Add feedback box on press ESC
$(document).keyup(function(e) {
	// if (e.keyCode == 13)      // enter
	if (e.keyCode == 27) { //esc
		$feedbackAdd.hide();
	}
});

