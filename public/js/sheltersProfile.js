//user information field
const shelterUserInfo = document.getElementById("shelterUserInfo");
const shelterEditData = document.getElementById("editData");
const shelterSaveData = document.getElementById("saveData");
const shelterEmailId = document.getElementById("email");

//passwordForm field
const shelterPasswordForm = document.getElementById("shelterPasswordForm");
const shelterEditPassword = document.getElementById("editPassword");
const shelterSavePassword = document.getElementById("savePassword");
const shelterPassword = document.getElementById("shelterPassword");

var pathname = window.location.pathname;

function validateShelterUserForm() {
  const phoneNumberRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im; //regex to check phone Number

  if (!phoneNumberRegex.test($("#phoneNumber").val())) {
    alert("You must enter a valid Phone Number.");
    $("#phoneNumber").focus();
    return false;
  }

  const zipCodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/; //regex to check zipcode
  if (!zipCodeRegex.test($("#zipCode").val())) {
    alert("You must enter a valid zip code.");
    $("#zipCode").focus();
    return false;
  }
  return true;
}

function validateShelterPassword() {
  if ($("#shelterPassword").val().trim().length < 6) {
    alert("You must enter a password with atleast 6 characters.");
    $("#shelterPassword").focus();
    return false;
  }
}

function shelterUserProfile() {
  window.addEventListener("load", (event) => {
    event.preventDefault();
    formShelter(shelterUserInfo, true);
    shelterEditData.disabled = false;
    shelterSaveData.disabled = true;
    shelterEmailId.disabled = true;
    shelterPassword.disabled = true;
    // alert($("#password").val());
    shelterEditPassword.disabled = false;
    shelterSavePassword.disabled = true;
    // $("#userInfo:input").prop("disabled", true);
  });

  shelterEditData.addEventListener("click", (event) => {
    event.preventDefault();
    formShelter(shelterUserInfo, false);
    shelterEmailId.disabled = true;
    shelterEditData.disabled = true;
    shelterSaveData.disabled = false;
    //emailId.disabled = true;  //uncomment this as value will come from session
  });

  shelterEditPassword.addEventListener("click", (event) => {
    event.preventDefault();
    shelterPassword.disabled = false;
    shelterPassword.value = "";
    shelterEditPassword.disabled = true;
    shelterSavePassword.disabled = false;
  });
}

function validateShelterImage() {
  if ($("#shelterprofilePicture").val().trim() == "") {
    alert("You must provide photo");
    return false;
  }
  return true;
}

function formShelter(formId, value) {
  var formData = formId;
  var i;
  for (i = 0; i < formData.length; i++) formData[i].disabled = value;
  // $("#userInfo:input").prop("disabled", true);
}

if (pathname === "/shelterUser") {
  shelterUserProfile();
}

if (pathname === "/shelterUser/changePassword") {
  window.location.pathname = "/shelterUser";
  shelterUserProfile();
}

if (pathname === "/shelterUser/changeProfileImage") {
  window.location.pathname = "/shelterUser";
  shelterUserProfile();
}
