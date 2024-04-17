function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);

  if (elements.length >= 1) {
    elements[0].remove();
  }
}

function displayMessage(parentElement, message) {
  const showMessage = document.createElement("div");

  showMessage.className = "show-message";
  showMessage.textContent = message;

  showMessage.style.cssText = `
    color: red;
    font-size: 14px;
    margin-top: 8px;
  `;

  parentElement.appendChild(showMessage);

  setTimeout(() => {
    showMessage.remove();
  }, 2000);
}

function setFriendDropdownStyle() {
  const friendsDropdown = document.createElement("select");
  const initialFriendsOption = document.createElement("option");

  initialFriendsOption.value = "친구항목";
  initialFriendsOption.text = "친구항목";
  initialFriendsOption.disabled = true;
  initialFriendsOption.selected = true;
  friendsDropdown.appendChild(initialFriendsOption);

  friendsDropdown.style.cssText = `
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  `;

  return friendsDropdown;
}

function createCustomCursor(x, y) {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";

  cursor.style.cssText = `
    cursor: crosshair;
    position: absolute;
    left: ${x - 15}px;
    top: ${y - 15}px;
    width: 30px;
    height: 30px;
    z-index: 1000;
    border-radius: 50%;
    box-sizing: border-box;
    border: 2px solid black;
  `;

  return cursor;
}

function setModalStyle(shadowHost, modal, x, y) {
  modal.className = "newComment";

  modal.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 300px;
    min-height: 100px;
    max-height: 80vh;
    z-index: 9999;
    background: white;
    border: 1px solid black;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  `;

  shadowHost.style.left = `${x}px`;
  shadowHost.style.top = `${y}px`;
}

function handleMouseMove(event) {
  const x = event.pageX;
  const y = event.pageY;

  const cursor = createCustomCursor(x, y);

  const isOverModal = document.querySelector(".shadowHost:hover");

  if (!isOverModal) {
    const existingCursor = document.querySelector(".custom-cursor");

    if (existingCursor) {
      existingCursor.remove();
    }

    document.body.appendChild(cursor);
    document.body.style.cursor = "none";
  } else {
    const existingCursor = document.querySelector(".custom-cursor");
    if (existingCursor) {
      existingCursor.remove();
    }

    document.body.style.cursor = "auto";
  }
}

function openModal(x, y, userFriendsList, userEmail, userNickname) {
  removeElementsByClass("shadowHost");

  const shadowHost = document.createElement("div");
  const shadowRoot = shadowHost.attachShadow({ mode: "closed" });
  shadowHost.className = "shadowHost";

  const modal = document.createElement("form");
  let emails = [];
  const getEmails = () => emails;
  const setEmails = (newEmails) => {
    emails = newEmails;
  };

  modal.setAttribute("name", "comment");
  modal.addEventListener("submit", function (event) {
    handleSubmit(event, publicUsers, modal, getEmails);
  });

  const topContainer = document.createElement("div");
  topContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 5px;
  `;

  const nicknameDisplay = document.createElement("div");
  nicknameDisplay.textContent = userNickname;
  nicknameDisplay.style.cssText = `
    color: white;
    font-size: 16px;
    text-align: left;
  `;

  const allowPublic = document.createElement("select");
  allowPublic.className = "allow-public";
  allowPublic.style.cssText = `
    width: auto;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.6);
    color: black;
  `;

  const option1 = document.createElement("option");
  const option2 = document.createElement("option");

  option1.value = "공개";
  option1.text = "공개";
  option2.value = "비공개";
  option2.text = "비공개";

  allowPublic.appendChild(option1);
  allowPublic.appendChild(option2);

  const friendsDropdown = setFriendDropdownStyle();

  const textarea = document.createElement("textarea");
  textarea.style.cssText = `
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.7);
    color: white;
  `;

  const publicUsers = [];

  userFriendsList.forEach((friend) => {
    const friendOption = document.createElement("option");

    friendOption.value = `${friend.nickname}`;
    friendOption.text = friend.nickname;
    friendsDropdown.appendChild(friendOption);
    friendsDropdown.style.display = "none";
  });

  friendsDropdown.addEventListener("change", function (event) {
    const selectedFriend = event.target.value;
    textarea.value = textarea.value.replace("@", "");

    if (publicUsers.includes(selectedFriend)) {
      displayMessage(modal, "이미 추가된 사람입니다!");
      return;
    }

    displayMessage(modal, `${event.target.value}가 추가 되었습니다!`);
    publicUsers.push(selectedFriend);
    friendsDropdown.style.display = "none";
  });

  textarea.addEventListener("input", function (event) {
    const textareaValue = event.target.value;

    friendsDropdown.style.display = textareaValue.includes("@")
      ? "block"
      : "none";
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  `;

  const addEmailButton = document.createElement("button");
  addEmailButton.textContent = "✉︎";
  addEmailButton.style.cssText = `
    flex-grow: 1;
    background-color: #9575CD;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 30px;
    margin-right: 5px;
  `;

  addEmailButton.addEventListener("click", function (event) {
    event.preventDefault();
    createEmailModal(shadowHost, x, y, setEmails, getEmails);
  });

  function createEmailModal(shadowHost, x, y, setEmails, getEmails) {
    const emailModal = document.createElement("div");
    emailModal.style.cssText = `
      position: fixed;
      left: ${x + 30}px;
      top: ${y + 30}px;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      z-index: 10000;
      width: 220px;
    `;

    const mailList = getEmails();

    if (mailList && mailList.length > 0) {
      mailList.forEach((email) => {
        const existingEmailInput = document.createElement("input");
        existingEmailInput.type = "email";
        existingEmailInput.value = email;
        existingEmailInput.style.cssText = `
          width: 200px;
          padding: 5px;
          margin-bottom: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          background-color: rgba(0, 0, 0, 0.9);
          color: white;
        `;

        emailModal.insertBefore(existingEmailInput, emailModal.firstChild);
      });
    }

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "이메일을 입력하세요";
    emailInput.style.cssText = `
      width: 200px;
      padding: 5px;
      margin-bottom: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
    `;

    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
    `;

    const addButton = document.createElement("button");
    addButton.textContent = "추가";
    addButton.style.cssText = `
      flex: 1;
      padding: 5px;
      background-color: #9575CD;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
      margin-right: 30px;
    `;

    addButton.addEventListener("click", function () {
      const newEmailInput = emailInput.cloneNode();
      newEmailInput.value = "";
      emailModal.insertBefore(newEmailInput, buttonsContainer);
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "저장";
    saveButton.style.cssText = `
      flex: 1;
      padding: 3px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
      margin-right: 5px;
    `;

    saveButton.addEventListener("click", function () {
      const emailElements = emailModal.querySelectorAll("input[type='email']");
      const mailArray = Array.from(emailElements).map((input) => input.value);

      setEmails(mailArray);

      emailModal.remove();
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "닫기";
    closeButton.onclick = function () {
      emailModal.remove();
    };
    closeButton.style.cssText = `
      flex: 1;
      padding: 3px;
      background-color: #EF5350;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
    `;

    emailModal.appendChild(emailInput);

    buttonsContainer.appendChild(addButton);
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(closeButton);
    emailModal.appendChild(buttonsContainer);
    shadowHost.parentElement.appendChild(emailModal);
  }

  const submitButton = document.createElement("button");
  submitButton.textContent = "작성";
  submitButton.style.cssText = `
    flex-grow: 1;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 5px;
  `;

  const closeButton = document.createElement("button");
  closeButton.textContent = "닫기";
  closeButton.style.cssText = `
    flex-grow: 1;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;

  closeButton.addEventListener("click", function (event) {
    event.preventDefault();

    removeElementsByClass("shadowHost");
    document.removeEventListener("mousemove", handleMouseMove);
  });

  if (userEmail === "itscomments16@gmail.com") {
    friendsDropdown.style.display = "none";
    allowPublic.style.display = "none";
    addEmailButton.style.display = "none";
  }

  topContainer.appendChild(nicknameDisplay);
  topContainer.appendChild(allowPublic);

  modal.appendChild(topContainer);
  modal.appendChild(textarea);
  modal.appendChild(friendsDropdown);

  buttonContainer.appendChild(addEmailButton);
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(closeButton);

  modal.appendChild(buttonContainer);

  shadowRoot.appendChild(modal);

  setModalStyle(shadowHost, modal, x, y);

  document.body.appendChild(shadowHost);

  modal.focus();

  return modal;
}

function handleSubmit(event, publicUsers, modal, getEmails) {
  event.preventDefault();

  const shadowHostElements = document.body.getElementsByClassName("shadowHost");
  const textareaElement = event.target.querySelector("textarea");
  const allowPublic = event.target.getElementsByClassName("allow-public");
  const recipientEmail = getEmails();

  const shadowHostElement = shadowHostElements[0];

  const x = shadowHostElement.style.left;
  const y = shadowHostElement.style.top;

  const postCoordinate = {
    x,
    y,
  };

  let selectValue;

  if (allowPublic[0].value === "공개") {
    selectValue = true;
  } else {
    selectValue = false;
  }

  if (textareaElement.value.length > 200) {
    displayMessage(modal, "200자 이하로 작성해주세요");
    return;
  } else if (textareaElement.value.length < 1) {
    displayMessage(modal, "1글자 이상 작성해주세요");
    return;
  }

  const nowDate = new Date();

  chrome.runtime.sendMessage({
    action: "submitForm",
    data: {
      inputValue: textareaElement.value,
      allowPublic: selectValue,
      recipientEmail,
      postCoordinate,
      publicUsers,
      nowDate,
    },
  });

  setTimeout(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    removeElementsByClass("shadowHost");
  }, 300);
}

document.addEventListener(
  "click",
  function (event) {
    chrome.storage.local.get(["userData", "userFriends"], (result) => {
      const userFriendsList = result.userFriends;
      const userEmail = result.userData.email;
      const userNickname = result.userData.nickname;
      const offsetX = event.pageX;
      const offsetY = event.pageY;
      console.log("친구가 누구니?", userFriendsList);
      console.log("친구가 누구니?", result.userData.friends);
      openModal(offsetX, offsetY, userFriendsList, userEmail, userNickname);
    });
  },
  { once: true },
);

document.addEventListener("mousemove", handleMouseMove);
