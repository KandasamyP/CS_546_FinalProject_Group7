
(function($) {
  var addReviewForm = $('#addReviewForm');
  var reviewBody = $('#reviewBody');
  var rating = $('#rating');
  var reviewError = $('#reviewError');
  var successMessage = $('#successMessage');

  console.log("form is called");

  addReviewForm.submit(function(event) {
    event.preventDefault();
    var mainContainer = $("main-container");
    console.log("Add review submit btn is clicked");

    if(!reviewBody.val() || !rating.val()) {
      console.log("form needs to submit");
      reviewError.attr("hidden", false);
      return;
    } 
    var urlGetId = window.location.pathname, linkToId;
    const url = urlGetId.split("/");
    if(urlGetId.split("/").length == 3) {
      linkToId = url[2];
      console.log(linkToId);
    }
    var requestConfig = {
      method: 'POST',
      url: `/shelters/addReviews/${linkToId}`,
      contentType: 'application/json',
      data: JSON.stringify({
        reviewBody: reviewBody.val(),
        rating: rating.val()
      })
  };

  $.ajax(requestConfig).then(function(responseMessage) {
    reviewError.attr("hidden", true);
    successMessage.attr("hidden", false);
    setTimeout(function () {
      successMessage.attr("hidden", true);
    }, 5000);
    console.log("Add review submit btn is clicked" + responseMessage.rating);
    var shelterReviewContainer = $("shelter-review-container");
    let div = document.createElement('div');
    div.innerHTML = responseMessage.rating;
    // show.append(h1);
    // let img = document.createElement('img');
    // if (responseMessage.image !== null && responseMessage.image.medium){
    //     img.src = responseMessage.image.medium;
    // }
    // else{
    //     img.src = "public/js/no_image.jpeg";
    // }
    shelterReviewContainer.append(div);


  });
    
  });
})(window.jQuery);