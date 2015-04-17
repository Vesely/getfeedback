$(function() {

    var $progress = $('.progress');
    var $designInput = $('.form .design-input');
    var $formModal = $('.form-modal');
    var $formModalInput = $formModal.find('.form-control');


    $designInput.fileupload({
        url: 'api/designs/uploadDesign',
        dataType: 'json',
        done: function (e, data) {
            console.log(data);
            $formModal.removeClass('hidden');
            $formModalInput.focus();

            var fileName = data.result.fileName;
            console.log(fileName);
            $formModal.find('.design-src').val(fileName);
            
            // $.each(data.result.files, function (index, file) {
            //     $('<p/>').text(file.name).appendTo('#files');
            // });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('.progress').css(
                'height',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
}); 