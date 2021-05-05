$(function () {
  let myForm = $("#petOwner-signupForm");
  let email = $("#email");
  let password = $("#password");
  let fname = $("#fname");
  let lname = $("#lname");
  let dateOfBirth = $("#dateOfBirth");
  let profilePicture = $("#profilePicture");
  let zipCode = $("#zipCode");
  let phoneNumber = $("#phoneNumber");
  let biography = $("#biography");

  if (myForm) {
    myForm.submit(function (event) {
      event.preventDefault();
      var email_term = email.val();
      var password_term = password.val();
      var fname_term = fname.val();
      var lname_term = lname.val();
      var dateOfBirth_term = dateOfBirth.val();
      var profilePicture_term = profilePicture.val();
      var zipCode_term = zipCode.val();
      let phoneNumber_term = phoneNumber.val();
      var biography_term = biography.val();
      let error = $("#error");
      let errorList = $("#errorList");

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

      if (!fname_term || fname_term.trim() === "") {
        errorList.append(`<li>First name must be provided!</li>`);
        error.show();
      }
      if (!lname_term || lname_term.trim() === "") {
        errorList.append(`<li>Last name must be provided!</li>`);
        error.show();
      }

      if (!dateOfBirth_term || dateOfBirth_term.trim() === "") {
        errorList.append(`<li>DOB must be provided!</li>`);
        error.show();
      }

      //Phone Number
      function validatePhoneNumber(phoneNumber) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phoneNumber));
      }
      if (phoneNumber_term) {
        if (!validatePhoneNumber(phoneNumber_term)) {
          errorList.append(`<li>Phone Number must be in correct format!</li>`);
          error.show();
        }
      }

      function validateZipCode(zipCode) {
        const re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
        return re.test(String(zipCode));
      }
      if (zipCode_term) {
        if (!validateZipCode(zipCode_term)) {
          errorList.append(`<li>Zip Code must be in correct format!</li>`);
          error.show();
        }
      }

      if (error.is(":hidden")) {
        myForm.unbind().submit();
        myForm.submit();
      }
    });
  }
});
