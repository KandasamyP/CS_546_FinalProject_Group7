$(function () {
  let myForm = $("#shelterRescue-signupForm");
  let profilePicture = $("#profilePicture");
  let name = $("#name");
  let email = $("#email");
  let password = $("#password");
  let locationStateId = $("#stateId");
  let locationCityId = $("#cityId");
  let biography = $("#biography");
  let phoneNumber = $("#phoneNumber");
  let website = $("#website");
  let socialMedia = $("#socialMedia");
  let error = $("#error");
  let errorList = $("#errorList");

  if (myForm) {
    myForm.submit(function (event) {
      event.preventDefault();

      var profilePicture_term = profilePicture.val();
      var name_term = name.val();
      var email_term = email.val();
      var password_term = password.val();
      let locationStateId_term = locationStateId.val();
      let locationCityId_term = locationCityId.val();
      var biography_term = biography.val();
      var phoneNumber_term = phoneNumber.val();
      var website_term = website.val();
      var socialMedia_term = socialMedia.val();

      errorList.empty();
      error.hide();

      if (!profilePicture_term || profilePicture_term.trim() === "") {
        errorList.append(
          `<li>Profile Picture public URL must be provided!</li>`
        );
        error.show();
      }
      if (!name_term || name_term.trim() === "") {
        errorList.append(`<li>Shelter/Rescue name must be provided!</li>`);
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
      if (
        !locationStateId_term ||
        !locationCityId_term ||
        locationStateId_term === "Select State" ||
        locationCityId_term === "Select City"
      ) {
        errorList.append(`<li>Location State & City must be provided!</li>`);
        error.show();
      }
      if (!biography_term || biography_term.trim() === "") {
        errorList.append(`<li>Biography must be provided!</li>`);
        error.show();
      }
      if (!phoneNumber_term || phoneNumber_term.trim() === "") {
        errorList.append(`<li>Phone Number must be provided!</li>`);
        error.show();
      }
      if (!website_term || website_term.trim() === "") {
        errorList.append(`<li>Website URL must be provided!</li>`);
        error.show();
      }
      if (!socialMedia_term || socialMedia_term.trim() === "") {
        errorList.append(`<li>Social Media URL must be provided!</li>`);
        error.show();
      }

      if (error.is(":hidden")) {
        myForm.unbind().submit();
        myForm.submit();
      }
    });
  }
});
