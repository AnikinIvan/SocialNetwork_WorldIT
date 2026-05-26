const csrfToken = document.querySelector("meta[name='csrf-token']").content;
const friendsMainList = document.getElementById("friendsMainList");

async function handleFriendAction(actionButton) {
  const response = await fetch(actionButton.dataset.url, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken },
  });
  const data = await response.json();

  if (data.friend_html) {
    addFriendToMain(data.friend_html);
  }
  if (data.label) {
    actionButton.textContent = data.label;
  }
  if (data.remove) {
    actionButton.closest(".person-card").remove();
  }
}

function addFriendToMain(friendHtml) {
  const friendsCount = friendsMainList.querySelectorAll(".person-card").length;
  if (friendsCount < 6) {
    friendsMainList.insertAdjacentHTML(friendHtml);
    connectFriendActionButtons(friendsMainList);
  }
}

function connectFriendActionButtons(parent = document) {
  const actionButtons = parent.querySelectorAll(".action-button");
  actionButtons.forEach((actionButton) => {
    if (!actionButton.dataset.eventConnected) {
      actionButton.dataset.eventConnected = true;
      actionButton.addEventListener("click", async () => {
        await handleFriendAction(actionButton);
      });
    }
  });
}

connectFriendActionButtons();

window.connectFriendActionButtons = connectFriendActionButtons;
