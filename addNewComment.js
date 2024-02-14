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
  const initialOption = document.createElement("option");

  initialOption.value = "친구항목";
  initialOption.text = "친구항목";
  initialOption.disabled = true;
  initialOption.selected = true;
  friendsDropdown.appendChild(initialOption);

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
    min-height: 200px;
    max-height: 80vh;
    z-index: 1000;
    background: white;
    border: 1px solid black;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px;
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

function openModal(x, y, userFriendsList) {
  removeElementsByClass("shadowHost");

  const shadowHost = document.createElement("div");
  const shadowRoot = shadowHost.attachShadow({ mode: "open" });
  shadowHost.className = "shadowHost";

  const modal = document.createElement("form");

  modal.setAttribute("name", "comment");
  modal.addEventListener("submit", function (event) {
    handleSubmit(event, publicUsers, modal);
  });

  const friendsDropdown = setFriendDropdownStyle();

  const textarea = document.createElement("textarea");
  textarea.style.cssText = `
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10px;
    box-sizing: border-box;
  `;

  const emailInput = document.createElement("input");
  emailInput.style.cssText = `
    width: calc(100% - 22px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10px;
  `;

  const allowPublic = document.createElement("select");
  allowPublic.style.cssText = `
    margin-top: 10px
  `;

  const option1 = document.createElement("option");
  const option2 = document.createElement("option");

  option1.value = "공개";
  option1.text = "공개";
  option2.value = "비공개";
  option2.text = "비공개";

  allowPublic.appendChild(option1);
  allowPublic.appendChild(option2);

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

  const addEmailButton = document.createElement("button");

  addEmailButton.style.cssText = `
    background-color: #3498db;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    width: 100%;
  `;

  emailInput.setAttribute("type", "email");
  emailInput.setAttribute("name", "email");
  emailInput.placeholder = "이메일을 입력하세요";

  addEmailButton.textContent = "이메일 추가";

  addEmailButton.addEventListener("click", function (event) {
    event.preventDefault();

    const newEmailInput = document.createElement("input");
    newEmailInput.setAttribute("type", "email");
    newEmailInput.setAttribute("name", "email");
    newEmailInput.placeholder = "이메일을 입력하세요";

    newEmailInput.style.cssText = `
      width: calc(100% - 22px);
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-top: 10px;
    `;

    modal.insertBefore(newEmailInput, emailInput.nextSibling);
  });

  const submitButton = document.createElement("button");
  submitButton.style.cssText = `
    background-color: #3498db;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
  `;
  submitButton.textContent = "전송";

  const closeButton = document.createElement("button");
  closeButton.textContent = "닫기";
  closeButton.style.cssText = `
    background-color: #e74c3c;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
  `;

  closeButton.addEventListener("click", function (event) {
    event.preventDefault();

    removeElementsByClass("shadowHost");
    document.removeEventListener("mousemove", handleMouseMove);
  });

  modal.appendChild(textarea);
  modal.appendChild(friendsDropdown);
  modal.appendChild(emailInput);
  modal.appendChild(addEmailButton);
  modal.appendChild(allowPublic);
  modal.appendChild(submitButton);
  modal.appendChild(closeButton);

  shadowRoot.appendChild(modal);

  setModalStyle(shadowHost, modal, x, y);

  document.body.appendChild(shadowHost);

  modal.focus();

  return modal;
}

function handleSubmit(event, publicUsers, modal) {
  event.preventDefault();

  const shadowHostElements = document.body.getElementsByClassName("shadowHost");
  const textareaElement = event.target.querySelector("textarea");
  const allowPublic = event.target.querySelector("select");
  const emailElements = event.target.querySelectorAll("input[name='email']");
  const recipientEmail = Array.from(emailElements).map(
    (emailInput) => emailInput.value,
  );

  const shadowHostElement = shadowHostElements[0];

  const x = shadowHostElement.style.left;
  const y = shadowHostElement.style.top;

  const postCoordinate = {
    x,
    y,
  };

  let selectValue;

  if (allowPublic.value === "공개") {
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

  chrome.runtime.sendMessage(
    {
      action: "submitForm",
      data: {
        inputValue: textareaElement.value,
        allowPublic: selectValue,
        recipientEmail,
        postCoordinate,
        publicUsers,
        nowDate,
      },
    },
    function (response) {
      console.log(response);
    },
  );

  document.removeEventListener("mousemove", handleMouseMove);
  removeElementsByClass("shadowHost");
}

document.addEventListener(
  "click",
  function (event) {
    chrome.storage.local.get(["userFriends"], (result) => {
      const userFriendsList = result.userFriends;
      const offsetX = event.pageX;
      const offsetY = event.pageY;

      openModal(offsetX, offsetY, userFriendsList);
    });
  },
  { once: true },
);

document.addEventListener("mousemove", handleMouseMove);
