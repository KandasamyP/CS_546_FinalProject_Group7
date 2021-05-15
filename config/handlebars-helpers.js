const moment = require("moment");

module.exports = {
  doctype: () => {
    return "<!DOCTYPE html>";
  },

  login: (isLoggedIn) => {
    if (isLoggedIn.data.root.isLoggedIn) {
      var html = `
        <div id="logout">
            <button
                onclick="location.href = '/logout'"
                type="button"
                class="logout"
            >Logout</button>
        </div>
        `;

      return html;
    } else {
      var html = `
        <div id="login">
            <button
                id="loginButton"
                onclick="location.href = '/login'"
                type="button"
                class="login"
            >Log In</button>
        </div>
        <div id="signup">
            <button
                id="srSignup"
                onclick="location.href = '/signup/sr'"
                type="button"
                class="signup"
            >Shelter/Rescue - Sign Up</button>
            <br />
            <button
                id="popaSignup"
                onclick="location.href = '/signup/popa'"
                type="button"
                class="signup"
            >Pet Owner/Adopter - Sign Up</button>
        </div>
        `;

      return html;
    }
  },
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  ifUserIsSender: function (senderId, userId) {
    return senderId === userId ? "user" : "recipient";
  },
  ifMessageSent: function (recipient, participant) {
    if (recipient === participant) {
      return "reloaded";
    }
    return;
  },
  setSenderName: function (
    senderId,
    userId,
    petOwnerName,
    shelterName,
    isUserShelter
  ) {
    if (senderId === userId) {
      return "You";
    } else {
      if (isUserShelter) {
        return petOwnerName;
      } else {
        return shelterName;
      }
    }
  },
  prefillRadioButton: function (originalValue, formValue) {
    if (originalValue === formValue) {
      return "checked";
    } else {
      return "";
    }
  },
  prefillCheckboxes: function (originalValues, formValue) {
    for (let val of originalValues) {
      if (val === formValue) {
        return "checked";
      }
    }
    return;
  },
};
