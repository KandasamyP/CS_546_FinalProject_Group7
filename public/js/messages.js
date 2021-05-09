$(document).ready(function () {
    $(".message-user").hide();
    $(".message-recipient").hide();
    $("form").hide();

    $(".reloaded").show(); // if message was sent from inbox, show the thread
  
    // get id of message thread that the user clicks on
    $(".message-threads").click(function () { 
        $(".message-user").hide();
        $(".message-recipient").hide();
        let id = $(this).attr("id");
        $("#message-container").removeAttr("hidden");
        $(`.${id}`).show();
        $(`form:not(.${id})`).hide();
    });
});
  
$(function() {
    // Get the form.
    let form = $("#send-message-form");

    $(form).submit(function(event) {
		// Stop the browser from submitting the form.
		event.preventDefault();

		let formData = $(form).serialize();
        let recipientId = $("input[name='recipient']", $(form)).val(); 

		// Submit the form using AJAX.
		$.ajax({
			type: "POST",
			url: $(form).attr("action"),
			data: formData,
            success: function(data) {
                let id = recipientId; // todo trying to show the same thread after the page reloads but doesn't work... added a fix for it above
                $("#message-container").removeAttr("hidden");
                $(`.${id}`).show();
                $(`form:not(.${id})`).hide();
            }
		});
	});
});