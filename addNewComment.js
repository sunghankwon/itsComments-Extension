function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);

  if (elements.length >= 1) {
    elements[0].remove();
  }
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

function setModalStyle(modal, x, y) {
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
}

function handleMouseMove(event) {
  const x = event.pageX;
  const y = event.pageY;

  const cursor = createCustomCursor(x, y);

  const isOverModal = document.querySelector(".newComment:hover");

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

function openModal(x, y) {
  removeElementsByClass("newComment");

  const modal = document.createElement("form");
  modal.setAttribute("name", "comment");

  const textarea = document.createElement("textarea");
  const emailInput = document.createElement("input");
  const friendsDropdown = document.createElement("select");

  textarea.addEventListener("input", function (event) {
    const inputValue = event.target.value;

    if (inputValue.includes("@")) {
      friendsDropdown.style.display = "block";
    } else {
      friendsDropdown.style.display = "none";
    }
  });

  const allowPublic = document.createElement("select");

  const option1 = document.createElement("option");
  const option2 = document.createElement("option");

  option1.value = "공개";
  option1.text = "공개";
  option2.value = "비공개";
  option2.text = "비공개";

  allowPublic.appendChild(option1);
  allowPublic.appendChild(option2);

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

  modal.appendChild(textarea);
  modal.appendChild(emailInput);
  modal.appendChild(addEmailButton);
  modal.appendChild(submitButton);
  modal.appendChild(allowPublic);

  const closeButton = document.createElement("button");
  closeButton.textContent = "닫기";

  closeButton.addEventListener("click", function (event) {
    event.preventDefault();

    removeElementsByClass("newComment");
    document.removeEventListener("mousemove", handleMouseMove);
  });

  modal.appendChild(closeButton);
  setModalStyle(modal, x, y);

  document.body.appendChild(modal);

  modal.focus();

  return modal;
}

document.addEventListener(
  "click",
  function (event) {
    const offsetX = event.pageX;
    const offsetY = event.pageY;

    openModal(offsetX, offsetY);
  },
  { once: true },
);

document.addEventListener("mousemove", handleMouseMove);
