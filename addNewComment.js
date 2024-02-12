function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);

  if (elements.length >= 1) {
    elements[0].remove();
  }
}

function setFriendDropdownStyle() {
  const friendsDropdown = document.createElement("select");

  friendsDropdown.style.width = "100%";
  friendsDropdown.style.padding = "8px";
  friendsDropdown.style.border = "1px solid #ccc";
  friendsDropdown.style.borderRadius = "5px";
  friendsDropdown.style.fontFamily = "Arial, sans-serif";
  friendsDropdown.style.fontSize = "14px";

  return friendsDropdown;
}

function createCustomCursor(x, y) {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";

  cursor.style.cursor = "none";

  cursor.style.position = "absolute";
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
  cursor.style.width = "30px";
  cursor.style.height = "30px";
  cursor.style.zIndex = "1000";

  cursor.style.backgroundColor = "blue";
  cursor.style.borderRadius = "50%";

  return cursor;
}

function setModalStyle(shadowHost, modal, x, y) {
  modal.className = "newComment";

  modal.style.position = "absolute";
  modal.style.left = `${x}px`;
  modal.style.top = `${y}px`;
  modal.style.width = "300px";
  modal.style.height = "200px";
  modal.style.zIndex = "1000";

  modal.style.background = "white";
  modal.style.border = "1px solid black";
  modal.style.borderRadius = "10px";

  shadowHost.style.left = `${x}px`;
  shadowHost.style.top = `${y}px`;
}

function setUserIcon(userIcon) {
  const userIconImg = document.createElement("img");

  userIconImg.src = userIcon;
  userIconImg.style.width = "50px";
  userIconImg.style.height = "50px";
  userIconImg.style.position = "absolute";
  userIconImg.style.top = "0";
  userIconImg.style.left = "0";

  userIconImg.style.borderRadius = "50%";

  return userIconImg;
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

function openModal(x, y, userFriendsList, userIcon) {
  removeElementsByClass("shadowHost");

  const shadowHost = document.createElement("div");
  const shadowRoot = shadowHost.attachShadow({ mode: "open" });
  shadowHost.className = "shadowHost";

  const modal = document.createElement("form");
  modal.setAttribute("name", "comment");
  modal.addEventListener("submit", function (event) {
    handleSubmit(event, publicUsers);
  });

  const friendsDropdown = setFriendDropdownStyle();

  const textarea = document.createElement("textarea");
  const emailInput = document.createElement("input");
  const allowPublic = document.createElement("select");

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

  friendsDropdown.addEventListener("click", function (event) {
    const selectedFriend = event.target.value;
    textarea.value = textarea.value.replace("@", "");

    if (publicUsers.includes(selectedFriend)) {
      alert("이미 추가된 사람입니다!");
      return;
    }

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

    modal.insertBefore(newEmailInput, emailInput.nextSibling);
  });

  const submitButton = document.createElement("button");
  submitButton.textContent = "전송";

  const userIconImg = setUserIcon(userIcon);

  modal.appendChild(textarea);
  modal.appendChild(emailInput);
  modal.appendChild(addEmailButton);
  modal.appendChild(submitButton);
  modal.appendChild(allowPublic);
  modal.appendChild(friendsDropdown);
  modal.appendChild(userIconImg);

  const closeButton = document.createElement("button");
  closeButton.textContent = "닫기";

  closeButton.addEventListener("click", function (event) {
    event.preventDefault();

    removeElementsByClass("shadowHost");
    document.removeEventListener("mousemove", handleMouseMove);
  });

  shadowRoot.appendChild(modal);
  modal.appendChild(closeButton);
  setModalStyle(shadowHost, modal, x, y);

  document.body.appendChild(shadowHost);

  modal.focus();

  return modal;
}

function handleSubmit(event, publicUsers) {
  event.preventDefault();

  const shadowHostElement = document.body.getElementsByClassName("shadowHost");
  const textareaElement = event.target.querySelector("textarea");
  const allowPublic = event.target.querySelector("select");
  const emailElements = event.target.querySelectorAll("input[name='email']");
  const recipientEmail = Array.from(emailElements).map(
    (emailInput) => emailInput.value,
  );

  const x = shadowHostElement[0].style.left;
  const y = shadowHostElement[0].style.top;

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
    return alert("200자 이하로 작성해주세요!");
  } else if (textareaElement.value.length < 1) {
    return alert("1글자 이상 작성해주세요!");
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
    chrome.storage.local.get(["userFriends", "userIcon"], (result) => {
      const userFriendsList = result.userFriends;
      const userIcon = result.userIcon;
      const offsetX = event.pageX;
      const offsetY = event.pageY;

      console.log(userFriendsList);

      openModal(offsetX, offsetY, userFriendsList, userIcon);
    });
  },
  { once: true },
);

document.addEventListener("mousemove", handleMouseMove);
