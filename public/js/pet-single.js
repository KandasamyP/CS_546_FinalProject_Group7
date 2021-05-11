$(document).ready(function(){
    $("#send-message-form").on('submit',function(e){
        alert("Message sent! Make sure to check your messages for a reply.");
    });

    $('#remove-pet').on('submit', function(e){
        return confirm('Are you sure you want to remove this pet? This action cannot be undone.')
    });
});