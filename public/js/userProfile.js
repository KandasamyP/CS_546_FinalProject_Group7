const userInfo = document.getElementById("userInfo");
const editData = document.getElementById("editData");
const saveData = document.getElementById("saveData");
const emailId = document.getElementById("email");
var pathname = window.location.pathname;

function userProfile() {
  //window.onload = function(){form(userInfo, true)};
  window.addEventListener("load", (event) => {
    event.preventDefault();
    form(userInfo, true);
    editData.disabled = false;
    saveData.disabled = false;
    //$("#userInfo:input").prop("disabled", true);
  });

  editData.addEventListener("click", (event) => {
    event.preventDefault();
    form(userInfo, false);
    editData.disabled = true;
    saveData.disabled = false;
    //emailId.disabled = true;  //uncomment this as value will come from session
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
  function validateForm() {
    if ($("#firstName").val().trim() === "") {
      alert("You must enter First Name.");
      $("#firstName").focus();
      return false;
    }
    if ($("#lastName").val().trim() === "") {
      alert("You must enter Last Name.");
      $("#lastName").focus();
      return false;
    }

    if ($("#dateOfBirth").val().trim() === "") {
      //check for proper format
      alert("You must enter Date Of Birth.");
      $("#dateOfBirth").focus();
      return false;
    }

    if ($("#phoneNumber").val().trim() === "") {
      //check for proper format
      alert("You must enter Phone Number.");
      $("#phoneNumber").focus();
      return false;
    }

    if ($("#zipCode").val().trim() === "") {
      //check for proper format
      alert("You must enter zip code.");
      $("#zipCode").focus();
      return false;
    }

    const zipCodeRegex = /^\d{5}$/; //regex to check zipcode
    if (!zipCodeRegex.test($("#zipCode").val().trim())) {
      alert("You must enter a valid zip code.");
      $("#zipCode").focus();
      return false;
    }

    return true;
  }
}

if (pathname === "/user") {
  userProfile();
}
