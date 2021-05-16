(function ($) {
  var addReviewForm = $("#addReviewForm");
  var reviewBody = $("#reviewBody");
  var rating = $("#rating");
  var reviewError = $("#reviewError");
  var successMessage = $("#successMessage");
  var avgReviews = $("#avgReviews");
  var totalReviews = $("#totalReviews");
  var volunteerForm = $("#volunteerForm");
  var volunteerSuccessMessage = $("#volunteerSuccessMessage");

  addReviewForm.submit(function (event) {
    event.preventDefault();
    var mainContainer = $("main-container");

    if (!reviewBody.val() || !rating.val()) {
      reviewError.attr("hidden", false);
      return;
    }

    var urlGetId = window.location.pathname,
      linkToId;
    const url = urlGetId.split("/");

    if (urlGetId.split("/").length == 3) {
      linkToId = url[2];
    }

    var requestConfig = {
      method: "POST",
      url: `/sheltersAndRescue/addReviews/${linkToId}`,
      contentType: "application/json",
      data: JSON.stringify({
        reviewBody: reviewBody.val(),
        rating: rating.val(),
      }),
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      reviewError.attr("hidden", true);
      successMessage.attr("hidden", false);
      setTimeout(function () {
        successMessage.attr("hidden", true);
      }, 5000);
      var shelterReviewContainer = $("#shelter-review-container");
      rating.val = "";
      reviewBody.val = "";
      $("#reviewBody").val("");

      avgReviews.value = responseMessage.avgReviews;

      totalReviews.value = responseMessage.totalReviews;

      let outerDiv = document.createElement("div");
      let firstInnerdiv = document.createElement("div");
      outerDiv.append(firstInnerdiv);
      let h3 = document.createElement("h3");
      h3.innerHTML = responseMessage.reviewerName;
      firstInnerdiv.append(h3);
      let first_firstInnerdiv = document.createElement("div");
      first_firstInnerdiv.innerHTML = "Rating: " + responseMessage.rating;
      firstInnerdiv.append(first_firstInnerdiv);
      let secondInnerdiv = document.createElement("div");
      secondInnerdiv.innerHTML = responseMessage.reviewDate;
      outerDiv.append(secondInnerdiv);
      let thirdInnerdiv = document.createElement("div");
      thirdInnerdiv.innerHTML = responseMessage.reviewBody;
      outerDiv.append(thirdInnerdiv);
      outerDiv.append(document.createElement("hr"));

      shelterReviewContainer.append(outerDiv);

      location.reload();
    });
  });

  volunteerForm.submit(function (event) {
    event.preventDefault();

    var urlGetId = window.location.pathname,
      linkToId;
    const url = urlGetId.split("/");

    if (urlGetId.split("/").length == 3) {
      linkToId = url[2];
    }

    var requestConfig = {
      method: "POST",
      url: `/sheltersAndRescue/addVolunteer/${linkToId}`,
      contentType: "application/json",
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      volunteerSuccessMessage.attr("hidden", false);
      setTimeout(function () {
        volunteerSuccessMessage.attr("hidden", true);
      }, 5000);

      location.reload();
    });
  });
})(window.jQuery);
