const _csrfMeta = document.querySelector("meta[name='csrf-token']");
const csrfToken = _csrfMeta ? _csrfMeta.content : null;
const friendsMainList = document.querySelector("#friendsMainList") || document.querySelector(".friends-main");

const modalFriends = document.getElementById("modalFriends");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const modalConfirmBtn = document.getElementById("modalConfirmBtn");

let pendingActionButton = null;

function openConfirmModal(actionButton) {
  pendingActionButton = actionButton;
  if (modalFriends) {
    modalFriends.classList.remove("hidden");
    modalFriends.classList.add("confirm-action");
  }
}

function closeConfirmModal() {
  pendingActionButton = null;
  if (modalFriends) {
    modalFriends.classList.add("hidden");
    modalFriends.classList.remove("confirm-action");
  }
}

if (modalCancelBtn) {
  modalCancelBtn.addEventListener("click", closeConfirmModal);
}

if (modalConfirmBtn) {
  modalConfirmBtn.addEventListener("click", async () => {
    const actionButton = pendingActionButton;
    closeConfirmModal();
    if (actionButton) {
      await handleFriendAction(actionButton);
    }
  });
}

async function handleFriendAction(actionButton) {
  const headers = {};
  if (csrfToken) headers["X-CSRFToken"] = csrfToken;

  let response;
  try {
    response = await fetch(actionButton.dataset.url, {
      method: "POST",
      headers,
    });
  } catch (err) {
    console.error("Мережева помилка", err);
    return;
  }

  if (!response.ok) {
    console.error("Помилка сервера", response.status);
    return;
  }

  const data = await response.json();

  if (data.success === false) {
    console.error(data.message);
    return;
  }

  if (data.redirect) {
    window.location.href = data.redirect;
    return;
  }

  if (data.friend_html) {
    addFriendToMain(data.friend_html);
  }

  if (data.label) {
    actionButton.textContent = data.label;
  }

  if (data.remove) {
    if (actionButton.dataset.actionContext === "profile") {
      window.location.reload();
    } else {
      const removedCard = actionButton.closest(".card-user, .person-card");
      if (removedCard) removedCard.remove();
    }
  }
}

function addFriendToMain(friendHtml) {
  if (!friendsMainList) return;
  const friendsCount = friendsMainList.querySelectorAll(".card-user, .person-card").length;
  if (friendsCount < 6) {
    friendsMainList.insertAdjacentHTML('beforeend', friendHtml);
    connectFriendActionButtons(friendsMainList);
  }
}

function connectFriendActionButtons(parent = document) {
  const actionButtons = parent.querySelectorAll(".action-button");
  actionButtons.forEach((actionButton) => {
    if (!actionButton.dataset.eventConnected) {
      actionButton.dataset.eventConnected = true;
      actionButton.addEventListener("click", async () => {
        if (actionButton.dataset.confirm === "true") {
          openConfirmModal(actionButton);
        } else {
          await handleFriendAction(actionButton);
        }
      });
    }
  });
}

connectFriendActionButtons();
window.connectFriendActionButtons = connectFriendActionButtons;