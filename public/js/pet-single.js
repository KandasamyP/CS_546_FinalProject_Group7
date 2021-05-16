$(document).ready(function () {
  $("#send-message-form").on("submit", function (e) {
    alert("Message sent! Make sure to check your messages for a reply.");
  });

  $("#send-corrections").on("submit", function (e) {
    alert(
      "Correction suggestions have been sent to the shelter/rescue for review. Thank you!"
    );
  });

  $("#remove-pet").on("submit", function (e) {
    return confirm(
      "Are you sure you want to remove this pet? This action cannot be undone."
    );
  });

  // keep the dropdown from closing immediately
  $(".dropdown-menu").click(function (event) {
    event.stopPropagation();
  });

  // don't allow more than 2 breeds to be checked
  $("input.correctBreeds").on("change", function () {
    if ($("input[name='correctBreeds']:checked").length > 2) {
      this.checked = false;
    }
  });

  // don't allow more than 1 sex to be checked
  $("input.correctSex").on("change", function () {
    if ($("input[name='correctSex']:checked").length > 1) {
      this.checked = false;
    }
  });

  // don't allow more than 1 age to be checked
  $("input.correctAgeGroup").on("change", function () {
    if ($("input[name='correctAgeGroup']:checked").length > 1) {
      this.checked = false;
    }
  });
});
