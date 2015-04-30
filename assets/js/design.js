//Design page

//"Global" variables for design page
var designId = $('.design').data('id');

//Init idenifyPopup
var identifyPopup= new IdentifyPopup();

// Hide all feedback boxes (so useful comment, i know it :D)
var hideAllFeedbackBoxes = function () {
	$('.feedback-box').addClass('hidden');
}

//Show specifics feedback box
var showFeedbackBox = function (feedbackId) {
	$('.feedback-'+feedbackId).removeClass('hidden');
}


//Load design image
var loadDesignImage = function () {
	var designId = $('.design').data('id');
	io.socket.get('/api/designs?id='+designId, function (design) {
		// console.log(design.src);
		var $img = $('.design .image img');
		$img.attr('src', '/uploads/'+design.src).error(function() { 
			setTimeout(function() {
				console.log("error loading image");
				$img.hide(0);
				loadDesignImage();
			}, 20);
		}).load(function() {
			$img.fadeIn(80);
		});
	});

};
loadDesignImage();


var sendFeedbackMessage = function(content, feedbackId) {
	//Send the message
	console.log('Odesílám odpověď do feedbacku');

	var userId = getUserFromStorage();

	console.log('content: ' + content);
	console.log('feedbackId: ' + feedbackId);

	//Create it
	io.socket.post('/api/feedbackMessages/create', {content: content, designId: designId, feedbackId: feedbackId, userId: userId}, function (response) {
		console.log(response);
		// $contentInput.val('');
		renderFeedbackMessages();
	});
};

//Function to open feedback box
var openFeedback = function() {
	hideAllFeedbackBoxes();
	var $feedback = $(this).parents('.feedback').first();
	var $feedbackBox = $feedback.find('.feedback-box');
	var feedbackId = $feedback.data('id');

	$feedbackBox.toggleClass('hidden');
	//console.log('clicked');

	//You read it
	$feedback.removeClass('unreaded');
	var hash = 'readed-design' + '' +designId + '-feedback' + feedbackId;
	if(typeof(Storage) !== "undefined") {// browser support localStorage/sessionStorage.
		localStorage.setItem(hash, true);
	}

	return false;	
};

//Add feedback message to database
var addFeedbackMessage = function() {
	redrawFeedbackBtn();
	console.log('chci přidat zpravu');
	//Variables
	var $form = $(this).parents('.form').first();
	var $contentInput = $form.find('.form-control');
	var content = $contentInput.val();
	// var designId = $form.data('designid');
	var feedbackId = $form.data('feedbackid');
	var userId = getUserFromStorage();
	
	$('.identify-popup .form').data('feedbackid', feedbackId);
	$('.identify-popup .form').data('content', content);

	if (!userId) {
		//Show identify popup
		identifyPopup.show(feedbackId);
	}else{
		//Send message
		sendFeedbackMessage(content, feedbackId);

		//Clear feedback input
		$contentInput.val('');
	}
	
	
	return false;
};


//Redraw button if you are logged in
var redrawFeedbackBtn = function () {
	var $feedbackForm = $('.feedback .form');
	var $sendBtn = $feedbackForm.find('.btn');
	//Change button (Is user logged or not)
	if (!getUserFromStorage()) {
		//Change button text
		$sendBtn.addClass('btn-identify');
		// $sendBtn.find('span').text('Identify yourself');
	}else{
		$sendBtn.removeClass('btn-identify');
		$sendBtn.find('span').text('Send it');
	}
};


var identifyUserByPopup = function() {
	console.log('Chci identifikovat uživatele.');
	var $form = $(this);
	var email = $form.find('.form-control').val();
	var feedbackId = $form.data('feedbackid');
	var content = $form.data('content');


	if (email) {
		io.socket.post('/api/user/findOrCreateUser', {email: email}, function (user) {
			//Save userId to local storage
			setUserToStorage(user.id);

			//Close identify popup
			identifyPopup.close();

			//
			var feedbackId = identifyPopup.getFeedbackId();

			if (feedbackId != 'add') {
				//Add Message
				$('.feedback-'+feedbackId).find('.btn').trigger('click');

				//Send message
				// sendFeedbackMessage(content, feedbackId);

				//Clear feedback input
				// $('.feedback-'+feedbackId).find('.form-msg .form-control').val('');
			}else{
				//Add feedback
				redrawFeedbackBtn();
				$('.feedback-add .btn').trigger('click');
			}

		});
	}


	return false;
};


//Rerun jquery functions
var rebuildFeedbackActions = function() {
	//Open feedbackbox
	$('.feedback .point').on('click', openFeedback);

	//Add feedback message
	$('.feedback .form-msg .btn').on('click', addFeedbackMessage);
	
	//Identify popup - set user
	$('.identify-popup .form').on('submit', identifyUserByPopup);

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

	$('.form-control').keypress(function(e) {
		//Submiting message by press Shift+enter
		if(e.which == 13 && e.shiftKey) {
			console.log('shiftenter');
			var $btn = $(this).parents('.form').first().find('.btn');
			$btn.trigger('click');
	    }
	});
};

//Load messages
var renderFeedbackMessages = function() {
	var $feedbacks = $('.renderFeedbacks .feedback');
	$('.other-messages').html('');
	io.socket.get('/api/user', function (usrs) {
		var users = [];
		for (var i = 0; i < usrs.length; i++) {
			var id = usrs[i].id;
			var email = usrs[i].email;

			// users.push({id: email})
			users[id] = email;
			// users.push({usrs[i].id});
		}

		$feedbacks.each(function(index){
			var $feedback = $(this);
			var feedbackId = $feedback.data('id');
			var $otherMessages = $feedback.find('.other-messages');

			// console.log(feedbackId);

			io.socket.get('/api/feedbackMessages?feedbackId='+feedbackId, function (messages) {
				for (var i = 0; i < messages.length; i++) {
					var msg = messages[i];
					// console.log(msg);
					$otherMessages.append('<div class="message message-'+msg.id+'" data-user="'+msg.userId+'"><p>'+msg.content+'</p><span class="badge user"></span></div>');
					var $msg = $('.message-'+msg.id);

					// console.log(msg);
					//Get user who write it
					var userEmail = users[msg.userId];
					$msg.find('.user').text(userEmail);
					
					//Am I author of this message?
					var myUserId = getUserFromStorage();
					if(myUserId == msg.userId) {
						$msg.find('.user').addClass('its-me');
					}
				};
				redrawFeedbackBtn();
			});
			
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
				'<div class="feedback feedback-exist unreaded feedback-'+fdb.id+'" data-id="'+fdb.id+'" style="top: '+fdb.top+'px; left: '+fdb.left+'px">' + 
					'<span class="point">'+(i+1)+'</span>' +
					'<div class="feedback-box hidden">' +
						'<div class="feedback-messages">' +
							'<div class="message">' +
								'<p>'+fdb.content+'</p>' +
								'<span class="badge user">'+	
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
			io.socket.get('/api/user?id='+fdb.userId, function (user) {
				$renderFeedbacks.find('.message .user').text(user.email);
				var myUserId = getUserFromStorage();
				if(myUserId == user.id) {
					$renderFeedbacks.find('.message .user').addClass('its-me');
				}
			});

			$('.feedback-add .point').text(feedbacks.length+1);
			
			var hash = 'readed-design' + '' +designId + '-feedback' + fdb.id;
			if(typeof(Storage) !== "undefined") {// browser support localStorage/sessionStorage.
				var result = localStorage.getItem(hash);
				console.log(hash + ' = ' + result);
				if (result != null) {
					//This point is readed
					console.log('readed //'+hash);
					$('.feedback-'+fdb.id).removeClass('unreaded');
				}
			}
		}


		renderFeedbackMessages();
		rebuildFeedbackActions();
	});

};
renderFeedbacks();

//Listening feedbacks api
io.socket.on("feedbacks", function(event){
	console.log('Změna ve "feedbacks"');
	renderFeedbacks();
});

//Listening feedbackMessages api
io.socket.on("feedbackmessages", function(event){
	console.log('Změna ve "feedbackMessages"');
	// renderFeedbackMessages();
	renderFeedbacks();
});

//Add feedback point
var $feedbackAdd = $('.feedback-add');
var $feedbackAddBox = $feedbackAdd.find('.feedback-box');
var $feedbackAddForm = $feedbackAdd.find('.form');
var $feedbackAddInput = $feedbackAddForm.find('.form-control');

var addTopPosition = 0;
var addLeftPosition = 0;

var addFeedbackPoint = function () {
	//Hide all feedback boxes
	hideAllFeedbackBoxes();
	$feedbackAdd.find('.feedback-box').removeClass('hidden');

	//Redrow btn (chceck if user is identify)
	redrawFeedbackBtn();

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

	addTopPosition = topInBox;
	addLeftPosition = leftInBox;

	//Focus the input
	$feedbackAddForm.find('.form-control').focus();

	console.log(topInBox);
	console.log(leftInBox);
	
	return false;
};



var sendFeedback = function() {
	//Variables
	var $form = $('.feedback-add .form');
	var $btn = $form.find('.btn');
	var $contentInput = $form.find('.form-control');
	var content = $contentInput.val();
	var designId = $form.find('.design-id').val();
	// var top = $form.data('top');
	// var left = $form.data('left');
	var top = addTopPosition;
	var left = addLeftPosition;
	var userId = getUserFromStorage();

	console.log('Odesílám feedback');

	// console.log('Top: '+top);
	// console.log('Left: '+left);

	if (!userId) {
		//Show identify popup
		identifyPopup.show();
	}else{
		//post
		io.socket.post('/api/feedbacks/create', {content: content, designId: designId, userId: userId, top: top, left: left}, function (response) {
			console.log(response);

			hideAllFeedbackBoxes();
			showFeedbackBox(response.id);

			renderFeedbacks();
	    });
		//Clear content input
		$contentInput.val('');
		$('.feedback-add').hide();
	}

	return false;
};

//On click at image => call function to add Point
$('.design .image').on('click', addFeedbackPoint);

//Create and send feedback
$('.feedback-add .form .btn').on('click', sendFeedback);

//Close Add feedback box on press ESC
$(document).keyup(function(e) {
	// if (e.keyCode == 13)      // enter
	if (e.keyCode == 27) { //esc
		$feedbackAdd.hide();
	}

});





