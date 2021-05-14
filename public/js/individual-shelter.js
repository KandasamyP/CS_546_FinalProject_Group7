
(function($) {
  var addReviewForm = $('#addReviewForm');
  var reviewBody = $('#reviewBody');
  var rating = $('#rating');
  var reviewError = $('#reviewError');
  var successMessage = $('#successMessage');
  var avgReviews = $("#avgReviews");
  var totalReviews = $("#totalReviews");
  var volunteerForm = $('#volunteerForm');

  console.log("form is called");

  addReviewForm.submit(function(event) {
   event.preventDefault();
    var mainContainer = $("main-container");
    console.log("Add review submit btn is clicked");

    if (!reviewBody.val() || !rating.val()) {
      reviewError.attr("hidden", false);
      return;
    } 
    
    var urlGetId = window.location.pathname, linkToId;
    const url = urlGetId.split("/");

    if (urlGetId.split("/").length == 3) {
      linkToId = url[2];
    }

    var requestConfig = {
      method: 'POST',
      url: `/sheltersAndRescue/addReviews/${linkToId}`,
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
      var shelterReviewContainer = $("#shelter-review-container");
      rating.val = "";
      reviewBody.val = "";
      $("#reviewBody").val("");

      console.log(responseMessage.totalReviews);
     // $("#avgReviews").val(responseMessage.avgReviews);

      avgReviews.value = responseMessage.avgReviews;
     // $("#totalReviews").val(responseMessage.totalReviews);

      totalReviews.value = responseMessage.totalReviews;
      
      // <div class="row">
      //     <div class="col-md-6">
      //         <h3>{{this.reviewerName}}</h3>
      //         <div>
      //             <p class="text-left"><span class="text-muted">Rating: {{this.rating}}</span> 
      //             </p>
      //         </div>
      //     </div>
      //     <div class="col-md-6">
      //         <p class="">{{this.reviewDate}}</p>
      //     </div>
      //     <div class="col-md-12">
      //         <p class="content">{{this.reviewBody}}</p>
      //     </div>
      // </div>
      let outerDiv = document.createElement('div');
    // outerDiv.addClass("row");
      let firstInnerdiv = document.createElement('div');
      outerDiv.append(firstInnerdiv);
      let h3 = document.createElement('h3');
      h3.innerHTML = responseMessage.reviewerName;
      firstInnerdiv.append(h3);
      let first_firstInnerdiv = document.createElement('div');
      first_firstInnerdiv.innerHTML = "Rating: " + responseMessage.rating;
      firstInnerdiv.append(first_firstInnerdiv);
      let secondInnerdiv = document.createElement('div');
      secondInnerdiv.innerHTML = responseMessage.reviewDate;
      outerDiv.append(secondInnerdiv);
      let thirdInnerdiv = document.createElement('div');
      thirdInnerdiv.innerHTML = responseMessage.reviewBody;
      outerDiv.append(thirdInnerdiv);
      outerDiv.append(document.createElement('hr'));

      shelterReviewContainer.append(outerDiv);

      location.reload();
    });
    
  });

  volunteerForm.submit(function(event) {
    event.preventDefault();
   
       
       var urlGetId = window.location.pathname, linkToId;
       const url = urlGetId.split("/");
   
       if (urlGetId.split("/").length == 3) {
         linkToId = url[2];
       }
   
       var requestConfig = {
         method: 'POST',
         url: `/sheltersAndRescue/addVolunteer/${linkToId}`,
         contentType: 'application/json',
       };
   
       $.ajax(requestConfig).then(function(responseMessage) {
        
   
         location.reload();
       });
       
     
  })
})(window.jQuery);