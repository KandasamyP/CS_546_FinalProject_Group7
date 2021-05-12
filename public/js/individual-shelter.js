(function($) {
  var addReviewForm = $('#addReviewForm');
  var reviewBody = $('#reviewBody');
  var rating = $('#rating');
  var reviewError = $('#reviewError');
  var successMessage = $('#successMessage');

  console.log("form is called");

  addReviewForm.submit(function(event) {
    event.preventDefault();
    console.log("Add review submit btn is clicked");

    if(!reviewBody.val() || !rating.val()) {
      console.log("form needs to submit");
      reviewError.attr("hidden", false);
      return;
    } 
    var requestConfig = {
      method: 'POST',
      url: `/shelters/addReviews/609841df6e0fe6a790ab212f`,
      contentType: 'application/json',
      data: JSON.stringify({
        reviewBody: reviewBody.val(),
        rating: rating.val()
      })
  };

  $.ajax(requestConfig).then(function(responseMessage) {
    reviewError.attr("hidden", true);
    successMessage.attr("hidden", false);
    console.log("Add review submit btn is clicked");
  });
    
  });
})(window.jQuery);