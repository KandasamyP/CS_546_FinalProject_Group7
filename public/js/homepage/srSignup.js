$(function () {
  let myForm = $("#shelterRescue-signupForm");
  let email = $("#email");
  let password = $("#password");
  let name = $("#name");
  let profilePicture = $("#profilePicture");
  let locationStateId = $("#stateId");
  let locationCityId = $("#cityId");
  let locationStreetId1 = $("#streetId1");
  let locationStreetId2 = $("#streetId12");
  let locationZipCodeId = $("#zipCodeId");
  let biography = $("#biography");
  let phoneNumber = $("#phoneNumber");
  let website = $("#website");
  let facebook = $("#facebook");
  let instagram = $("#instagram");
  let twitter = $("#twitter");
  let error = $("#error");
  let errorList = $("#errorList");
  let errorFromRoutes = $("#errorFromRoutes");
  error.hide();

  if (myForm) {
    myForm.submit(function (event) {
      event.preventDefault();

      var email_term = email.val();
      var password_term = password.val();
      var name_term = name.val();
      var profilePicture_term = profilePicture.val();
      let locationStateId_term = locationStateId.val();
      let locationCityId_term = locationCityId.val();
      let locationStreetId_term = locationStreetId1.val();
      if (locationStreetId2) {
        let locationApartmentId_term = locationStreetId2.val();
      }
      let locationZipCodeId_term = locationZipCodeId.val();
      var biography_term = biography.val();
      var phoneNumber_term = phoneNumber.val();
      if (website) {
        var website_term = website.val();
      }
      if (facebook) {
        var socialMediaFacebook_term = facebook.val();
      }
      if (instagram) {
        var socialMediaInstagram_term = instagram.val();
      }
      if (twitter) {
        var socialMediaTwitter_term = twitter.val();
      }

      errorList.empty();
      error.hide();
      if (errorFromRoutes) {
        errorFromRoutes.hide();
      }

      //Client Side Error handling

      //Email
      function validateEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

      if (!name_term || name_term.trim() === "") {
        errorList.append(`<li>Shelter/Rescue name must be provided!</li>`);
        error.show();
      }

      if (!profilePicture_term || profilePicture_term.trim() === "") {
        errorList.append(`<li>Profile Picture public must be provided!</li>`);
        error.show();
      }

      if (
        !locationStateId_term ||
        !locationCityId_term ||
        !locationStreetId_term ||
        locationStateId_term === "Select State" ||
        locationCityId_term === "Select City" ||
        locationStreetId_term.trim() === ""
      ) {
        errorList.append(
          `<li>Location State, City, Street & ZIP Code must be provided!</li>`
        );
        error.show();
      }

      function validateZipCode(zipCode) {
        const re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
        return re.test(String(zipCode));
      }
      if (locationZipCodeId_term) {
        if (!validateZipCode(locationZipCodeId_term)) {
          errorList.append(`<li>Zip Code must be in correct format!</li>`);
          error.show();
        }
      }

      if (!biography_term || biography_term.trim() === "") {
        errorList.append(`<li>Biography must be provided!</li>`);
        error.show();
      }

      //Phone Number
      function validatePhoneNumber(phoneNumber) {
        const re =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phoneNumber));
      }
      if (!phoneNumber_term || phoneNumber_term.trim() === "") {
        errorList.append(`<li>Phone Number must be provided!</li>`);
        error.show();
      } else if (!validatePhoneNumber(phoneNumber_term)) {
        errorList.append(`<li>Phone Number must be in correct format!</li>`);
        error.show();
      }

      if (error.is(":hidden")) {
        myForm.unbind().submit();
        myForm.submit();
      } else {
        $("html, body").animate({ scrollTop: 0 }, "slow");
      }
    });
  }
});
