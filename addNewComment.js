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

document.addEventListener(
  "click",
  function (event) {
    const offsetX = event.pageX;
    const offsetY = event.pageY;

    openModal(offsetX, offsetY);
  },
  { once: true },
);
