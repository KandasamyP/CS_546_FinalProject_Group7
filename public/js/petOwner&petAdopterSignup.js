$(function () {
  let myForm = $("#petOwner-signupForm");
  let profilePicture = $("#profilePicture");
  let fname = $("#fname");
  let lname = $("#lname");
  let email = $("#email");
  let password = $("#password");
  let phoneNumber = $("#phoneNumber");
  let zipCode = $("#zipCode");
  let biography = $("#biography");
  let dateOfBirth = $("#dateOfBirth");

  if (myForm) {
    myForm.submit(function (event) {
      event.preventDefault();

      var profilePicture_term = profilePicture.val();
      var fname_term = fname.val();
      var lname_term = lname.val();
      var email_term = email.val();
      let password_term = password.val();
      let phoneNumber_term = phoneNumber.val();
      var zipCode_term = zipCode.val();
      var biography_term = biography.val();
      var dateOfBirth_term = dateOfBirth.val();
      let error = $("#error");
      let errorList = $("#errorList");

      errorList.empty();
      error.hide();

      if (!profilePicture_term || profilePicture_term.trim() === "") {
        errorList.append(
          `<li>Profile Picture public URL must be provided!</li>`
        );
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
      if (!email_term || email_term.trim() === "") {
        errorList.append(`<li>E-Mail must be provided!</li>`);
        error.show();
      }
      if (!password_term || password_term.trim() === "") {
        errorList.append(`<li>Password must be provided!</li>`);
        error.show();
      }
      if (!phoneNumber_term || phoneNumber_term.trim() === "") {
        errorList.append(`<li>Phone Number must be provided!</li>`);
        error.show();
      }
      if (!zipCode_term || zipCode_term.trim() === "") {
        errorList.append(`<li>Zip Code must be provided!</li>`);
        error.show();
      }
      if (!biography_term || biography_term.trim() === "") {
        errorList.append(`<li>Biography must be provided!</li>`);
        error.show();
      }
      if (!dateOfBirth_term || dateOfBirth_term.trim() === "") {
        errorList.append(`<li>DOB must be provided!</li>`);
        error.show();
      }

      if (error.is(":hidden")) {
        myForm.unbind().submit();
        myForm.submit();
      }
    });
  }
});
