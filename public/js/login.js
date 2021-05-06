$(function () {
  let myForm = $("#login-form");
  let email = $("#email");
  let password = $("#password");
  let srUser = $("#srUser");
  let popaUser = $("#popaUser");
  let error = $("#error");
  let errorList = $("#errorList");

  if (myForm) {
    myForm.submit(function (event) {
      event.preventDefault();

      var email_term = email.val();
      var password_term = password.val();

      errorList.empty();
      error.hide();

      //Email
      function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
      if (!email_term || email_term.trim() === "") {
        errorList.append(`<li>E-Mail must be provided!</li>`);
        error.show();
      } else if (!validateEmail(email_term)) {
        errorList.append(`<li>E-Mail must be in correct format!</li>`);
        error.show();
      }

      if (!password_term || password_term.trim() === "") {
        errorList.append(`<li>Password must be provided!</li>`);
        error.show();
      }

      if (!srUser.is(":checked") && !popaUser.is(":checked")) {
        errorList.append(`<li>Must select user type!</li>`);
        error.show();
      }

      if (error.is(":hidden")) {
        myForm.unbind().submit();
        myForm.submit();
      }
    });
  }
});
