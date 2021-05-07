$(document).ready(function () {
  $("#dog-chosen").hide();
  $("#cat-chosen").hide();

  $("#choose-dog").click(function () {
    $("#cat-chosen").hide();
    $("#dog-chosen").show();
  });

  $("#choose-cat").click(function () {
    $("#dog-chosen").hide();
    $("#cat-chosen").show();
  });

  // keep the dropdown from closing immediately
  $(".dropdown-menu").click(function (event) {
    event.stopPropagation();
  });
});
