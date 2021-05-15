$(document).ready(function () {
  $(".dog-chosen").hide();
  $(".cat-chosen").hide();

  $("#dog").click(function () {
    $(".cat-chosen").hide();
    $(".dog-chosen").show();
  });

  $("#cat").click(function () {
    $(".dog-chosen").hide();
    $(".cat-chosen").show();
  });

  if ($('input#dog').is(':checked')) {
    $(".cat-chosen").hide();
    $(".dog-chosen").show();
  };

  if ($('input#cat').is(':checked')) {
    $(".dog-chosen").hide();
    $(".cat-chosen").show();
  };

  // don't allow more than 2 breeds to be checked
  $("input.breeds").on("change", function () {
    if ($("input[name='breeds']:checked").length > 2) {
      this.checked = false;
    }
  });

  // keep the dropdown from closing immediately
  $(".dropdown-menu").click(function (event) {
    event.stopPropagation();
  });

  // limit image upload to 5
  $(function () {
    $("input[type='submit']").click(function () {
      if (parseInt($("input[type='file']").get(0).files.length) > 5) {
        alert("You may upload no more than 5 images.");
      }
    });
  });
});
