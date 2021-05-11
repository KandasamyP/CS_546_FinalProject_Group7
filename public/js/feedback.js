$(function () {

    let myform = $("#feedback-form")
    let rating = $("#rating")
    let experience = $("#experience")
    let error = $("#error");
    let errorList = $("#errorList");
    let success = $("#success");

    if (myform) {
        myform.submit(function (event) {
            event.preventDefault();
            // var rating_val = rating.val();
            var experience_val = experience.val();

            errorList.empty();
            error.hide();
            success.hide()


            // if (!rating_val || rating_val.trim() === "") {
            //     errorList.append(`<li>Please provide a rating</li>`);
            //     error.show();
            // }
            if (!experience_val || experience_val.trim() === "") {
                errorList.append(`<li>Please provide an experience</li>`);
                error.show();
            }

            if (error.is(":hidden")) {
                myform.unbind().submit();
                myform.submit();
            }
        })
    }
})