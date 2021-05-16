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

  // scroll to bottom of chat if reloaded
  let messageDiv = $("#message-container");
  messageDiv.scrollTop(messageDiv.get(0).scrollHeight);
});
