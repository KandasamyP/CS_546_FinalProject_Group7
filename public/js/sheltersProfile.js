//user information field
const shelterUserInfo = document.getElementById("shelterUserInfo");
const shelterEditData = document.getElementById("editData");
const shelterSaveData = document.getElementById("saveData");
const shelterEmailId = document.getElementById("email");

//passwordForm field
const shelterPasswordForm = document.getElementById("shelterPasswordForm");
const shelterEditPassword = document.getElementById("editPassword");
const shelterSavePassword = document.getElementById("savePassword");
const shelterPassword = document.getElementById("password");

var pathname = window.location.pathname;

function validateShelterUserForm(){
   
}

function shelterUserProfile(){
    window.addEventListener("load", (event) => {
        event.preventDefault();
        form(shelterUserInfo, true);
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
        form(shelterUserInfo, false);
        shelterEmailId.disabled = true;
        shelterEditData.disabled = true;
        shelterSaveData.disabled = false;
        //emailId.disabled = true;  //uncomment this as value will come from session
      });
    
      shelterEditPassword.addEventListener("click", (event)=>{
        event.preventDefault();
        shelterPassword.disabled = false;
        shelterPassword.value = "";
        shelterEditPassword.disabled = true;
        shelterSavePassword.disabled = false;
      });

}

function form(formId, value) {
    var formData = formId;
    var i;
    for (i = 0; i < formData.length; i++) formData[i].disabled = value;
    // $("#userInfo:input").prop("disabled", true);
}

function validatePassword(){
    if ($("#password").val().trim() === ""){
        alert("You must provide password");
        $("#password").focus();
        return false;
    }
    return true;
}

if (pathname === "/shelterUser"){
    shelterUserProfile();
}

if( pathname === "/shelterUser/changePassword") {
    window.location.pathname = "/shelterUser";
    shelterUserProfile();
  }
  
  if( pathname === "/shelterUser/changeProfileImage") {
    window.location.pathname = "/shelterUser";
    shelterUserProfile();
  }