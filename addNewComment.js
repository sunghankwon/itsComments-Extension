function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);

  if (elements.length >= 1) {
    elements[0].remove();
  }
}

function openModal(x, y) {
  removeElementsByClass("newComment");

  const modal = document.createElement("form");
  modal.setAttribute("name", "comment");

  const submitButton = document.createElement("button");
  submitButton.textContent = "전송";

  modal.appendChild(submitButton);

  const closeButton = document.createElement("button");
  closeButton.textContent = "닫기";

  closeButton.addEventListener("click", function (event) {
    event.preventDefault();

    removeElementsByClass("newComment");
  });

  modal.appendChild(closeButton);

  modal.className = "newComment";
  modal.style.position = "absolute";
  modal.style.left = `${x}px`;
  modal.style.top = `${y}px`;
  modal.style.width = "300px";
  modal.style.height = "200px";
  modal.style.background = "white";
  modal.style.border = "1px solid black";
  modal.style.borderRadius = "10px";
  modal.style.zIndex = "1000";

  document.body.appendChild(modal);

  modal.focus();

  return modal;
}

function handleMouseMove(event) {
  const x = event.pageX;
  const y = event.pageY;

  const cursor = document.createElement("div");

  cursor.className = "custom-cursor";
  cursor.style.cursor = "none";
  cursor.style.position = "absolute";
  cursor.style.width = "30px";
  cursor.style.height = "30px";
  cursor.style.borderRadius = "50%";
  cursor.style.backgroundColor = "blue";
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
  cursor.style.zIndex = "1000";

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
