$(function () {

    let myform = $("#review-form")
    let rating = $("#inlineRadioOptions")
    let review = $("#review")
    let error = $("#error");
    let errorList = $("#errorList");

    if (myform) {
        myform.submit(function (event) {
            event.preventDefault();
            var rating_val = rating.val();
            var review_val = review.val();

            error.hide();

            if (!rating_val) {
                errorList.append(`<li>Please provide a rating</li>`);
                error.show();
            }
            if (!review_val || review_val.trim() === "") {
                errorList.append(`<li>Please provide a review.</li>`);
                error.show();
            }

            if (error.is(":hidden")) {
                myForm.unbind().submit();
                myForm.submit();
            }
        })
    }
})