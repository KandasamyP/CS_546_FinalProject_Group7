//userInformation fields
const userInfo = document.getElementById("userInfo");
const editData = document.getElementById("editData");
const saveData = document.getElementById("saveData");
const emailId = document.getElementById("email");

//passwordForm field
const passwordForm = document.getElementById("passwordForm");
const editPassword = document.getElementById("editPassword");
const savePassword = document.getElementById("savePassword");
const password = document.getElementById("password");

var pathname = window.location.pathname;

function userProfile() {
  //window.onload = function(){form(userInfo, true)};
  window.addEventListener("load", (event) => {
    event.preventDefault();
    form(userInfo, true);
    editData.disabled = false;
    saveData.disabled = true;
    emailId.disabled = true;
    password.disabled = true;
    editPassword.disabled = false;
    savePassword.disabled = true;
    //$("#userInfo:input").prop("disabled", true);
  });

  editData.addEventListener("click", (event) => {
    event.preventDefault();
    form(userInfo, false);
    emailId.disabled = true;
    editData.disabled = true;
    saveData.disabled = false;
    //emailId.disabled = true;  //uncomment this as value will come from session
  });

  editPassword.addEventListener("click", (event)=>{
    event.preventDefault();
    password.disabled = false;
    password.value = "";
    editPassword.disabled = true;
    savePassword.disabled = false;
  });

  function form(formId, value) {
    var formData = formId;
    var i;
    for (i = 0; i < formData.length; i++) formData[i].disabled = value;
    // $("#userInfo:input").prop("disabled", true);
  }

  // if (document.getElementById("alertBox").textContent != null){
  //   const alertMessage = document.getElementById("alertBox");
  //   console.log(alertMessage.textContent);
  //   (alert(alertMessage.textContent));
  // }
}

function validateForm() {
  // if ($("#firstName").val().trim() === "") {
  //   alert("You must enter First Name.");
  //   $("#firstName").focus();
  //   return false;
  // }
  const zipCodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/; //regex to check zipcode
  if (!zipCodeRegex.test($("#zipCode").val())) {
    alert("You must enter a valid zip code.");
    $("#zipCode").focus();
    return false;
  }

  const phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;  //regex to check phone Number
  if (!phoneNumberRegex.test($("#phoneNumber").val())) {
    alert("You must enter a valid Phone Number.");
    $("#phoneNumber").focus();
    return false;
  }
  return true;
}

function validatePassword(){
  if ($("#password").val().trim().length < 6) {
    alert("You must enter a password with atleast 6 characters.");
    $("#password").focus();
    return false;
  }
}

if (pathname === "/petOwner") {
  userProfile();
}

if( pathname === "/petOwner/changePassword") {
  window.location.pathname = "/petOwner";
  userProfile();
}

if( pathname === "/petOwner/changeProfileImage") {
  window.location.pathname = "/petOwner";
  userProfile();
}

if( pathname === "/petOwner/changeVolunteer") {
  window.location.pathname = "/petOwner";
  userProfile();
}