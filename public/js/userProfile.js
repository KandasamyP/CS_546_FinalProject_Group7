$(function() {
   $.ajax({
    url: '/petOwner/petCount',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    type: 'GET',
    dataType: 'json',
  
  }).then((data)=>{
    //$("#petCount").show();
    console.log(data);
    //$("#petCount").html(data);
  });

});



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

  // $("#saveData").click((event)=>{

  //     if ($("#firstName").val().trim() === ""){
  //         alert("You must enter First Name.");
  //         $("#firstName").focus();
  //     }
  //     if($("#lastName").val().trim() === ""){
  //         alert("You must enter Last Name.");
  //         $("#lastName").focus();
  //     }

  // });
  // success: function(response){
  //   $("#petCount").show();
  //   console.log(response);
  //   $("#petCount").append(response);
  // }
 
}


  $.ajax({
    url: '/petOwner/petCount',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    type: 'GET',
    dataType: 'json',
  }).then((data)=>{
    //$("#petCount").show();
    
    console.log(data);
    //$("#petCount").html(data);
  });


function validateForm() {
  // if ($("#firstName").val().trim() === "") {
  //   alert("You must enter First Name.");
  //   $("#firstName").focus();
  //   return false;
  // }
  // if ($("#lastName").val().trim() === "") {
  //   alert("You must enter Last Name.");
  //   $("#lastName").focus();
  //   return false;
  // }

  // if ($("#dateOfBirth").val().trim() === "") {
  //   //check for proper format
  //   alert("You must enter Date Of Birth.");
  //   $("#dateOfBirth").focus();
  //   return false;
  // }

  // if ($("#phoneNumber").val().trim() === "") {
  //   //check for proper format
  //   alert("You must enter Phone Number.");
  //   $("#phoneNumber").focus();
  //   return false;
  // }

  // if ($("#zipCode").val().trim() === "") {
  //   //check for proper format
  //   alert("You must enter zip code.");
  //   $("#zipCode").focus();
  //   return false;
  // }

  const zipCodeRegex = /^\d{5}$/; //regex to check zipcode
  if (!zipCodeRegex.test($("#zipCode").val())) {
    alert("You must enter a valid zip code.");
    $("#zipCode").focus();
    return false;
  }

  const phoneNumberRegex = /^\d{10}$/;  //regex to check phone Number

  if (!phoneNumberRegex.test($("#phoneNumber").val())) {
    alert("You must enter a valid Phone Number.");
    $("#phoneNumber").focus();
    return false;
  }
 
  return true;
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