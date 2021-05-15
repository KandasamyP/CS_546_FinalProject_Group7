$(function () {
  let myform = $("#feedback-form");
  let rating = $("#rating");
  let experience = $("#experience");
  let submitbutton = $("#submit-button");
  let error = $("#error");
  let errorList = $("#errorList");
  let successForm = $("#successForm");
  // let success = $("#success");

  if (myform) {
    myform.submit(function (event) {
      event.preventDefault();
      errorList.empty();
      error.hide();
      var rating_val = rating.val();
      var experience_val = experience.val();
      // success.hide()
      // success.show();
      if (!rating_val || rating_val.trim() === "") {
        errorList.append(`<li>Please provide a rating.</li>`);
        error.show();
      }
      if (rating_val < 1 || rating_val > 5) {
        errorList.append(`<li>Rating should be between 1 and 5</li>`);
        error.show();
      }
      if (isNaN(rating_val)) {
        errorList.append(`<li>Please provide a number for rating.</li>`);
        error.show();
      }
      if (!experience_val || experience_val.trim() === "") {
        errorList.append(`<li>Please provide an experience</li>`);
        error.show();
      }
      // success.show()
      successForm.append(`<h3> FeedBack Sent </h3>`);
      successForm.show();

      if (error.is(":hidden")) {
        alert("Feedback posted!");
        myform.unbind().submit();
        myform.submit();
      }
    });
  }
});
