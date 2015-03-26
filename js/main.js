//Javascript
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