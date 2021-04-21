const userInfo = document.getElementById("userInfo");
const editData = document.getElementById("editData");
const saveData = document.getElementById("saveData");

//window.onload = function(){form(userInfo, true)};

window.addEventListener("load", (event)=>{
    event.preventDefault();
    form(userInfo, true);
    editData.disabled = false;
    saveData.disabled = false;
    //$("#userInfo:input").prop("disabled", true);
});

editData.addEventListener("click", (event)=>{
    event.preventDefault();
   form(userInfo, false);
   editData.disabled = true;
   saveData.disabled = false;
});

function form(formId, value){
    var formData = formId;
    var i;
    for ( i =0; i < formData.length; i++)
        formData[i].disabled = value;
   // $("#userInfo:input").prop("disabled", true);
}

