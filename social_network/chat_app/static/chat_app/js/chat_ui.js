(function () {
  const state = {
    currentChatId: null,
    currentUserId: Number(document.querySelector('meta[name="current-user-id"]')?.content || 0),
  }

  const elements = {}

  function getCSRFToken() {
    return (
      document.querySelector('meta[name="csrf-token"]')?.content ||
      document.querySelector('[name=csrfmiddlewaretoken]')?.value ||
      ''
    )
  }

  function cacheElements() {
  elements.chatTitle = document.getElementById('chat-title')
  elements.chatStatus = document.getElementById('chat-status')
  elements.chatAvatar = document.getElementById('chat-avatar')
  elements.chatHeaderStatusIndicator = document.getElementById('chat-header-status-indicator')
  elements.chatWindow = document.getElementById('chat-window')
  elements.chatHeader = document.querySelector('.chat-header')
  elements.chatForm = document.getElementById('chat-message-form')
  elements.chatInput = document.getElementById('chat-input')
}

  function setChatActive(active) {
    elements.chatHeader?.classList.toggle('hidden', !active)
    elements.chatForm?.classList.toggle('hidden', !active)

    if (!active) {
      state.currentChatId = null
    }
  }

  function renderChat(data) {
    state.currentChatId = data.chat_id

    if (elements.chatTitle) {
      elements.chatTitle.textContent = data.chat_name || 'Чат'
    }

    if (elements.chatAvatar) {
      const name = data.chat_name || 'Чат'
      elements.chatAvatar.textContent = typeof getInitials === 'function'
        ? getInitials(name)
        : name.slice(0, 1).toUpperCase()
    }

    if (elements.chatWindow) {
  elements.chatWindow.classList.remove('placeholder-active')
  elements.chatWindow.innerHTML = ''

  window.renderMessages(elements.chatWindow, data.messages || [], state.currentUserId)

  scrollToBottom()
}

    setChatActive(true)
    window.ChatSocket.connect(data.chat_id)
  }

  function scrollToBottom() {
    if (!elements.chatWindow) return

      const scroll = () => {
        elements.chatWindow.scrollTop = elements.chatWindow.scrollHeight
      }

      requestAnimationFrame(scroll)
      setTimeout(scroll, 100)
      setTimeout(scroll, 300)
    }

  function addMessage(data) {
  if (!elements.chatWindow) return

  console.log('add message:', data)

  const bubble = window.createMessageBubble(
    data.message || '',
    Number(data.sender_id) === Number(state.currentUserId),
    data.created_at,
    data.sender_name,
    data.images || [],
    data.is_read || false,
    data.message_id || data.id || null
  )

  elements.chatWindow.appendChild(bubble)
  scrollToBottom()
}

function updateChatPreview(chatId, message, createdAt, senderId = null) {
  let button = document.querySelector(`.chat-user-button[data-chat-id="${chatId}"]`)

  if (!button && senderId) {
    button = document.querySelector(`.chat-user-button[data-chat-user="${senderId}"]`)
  }

  if (!button) return

  if (chatId) {
    button.dataset.chatId = chatId
  }

  const messageElement = button.querySelector('.user-message')
  const timeElement = button.querySelector('.message-time')

  if (messageElement) {
    messageElement.textContent = message || 'Фото'
  }

  if (timeElement) {
    const formattedTime = window.formatTime?.(createdAt)

    if (formattedTime) {
      timeElement.textContent = formattedTime
      timeElement.dataset.time = createdAt
    }
  }

  button.dataset.lastMessageTime = Date.now()
  sortChatsByLastMessage()
}

  function updateSectionUnreadBadge(selector, count) {
  const badge = document.querySelector(selector)
  const text = badge?.querySelector('span')

  if (!badge || !text) return

  if (count > 0) {
    text.textContent = count
    badge.style.display = 'flex'
  } else {
    text.textContent = ''
    badge.style.display = 'none'
  }
}

function applyUnreadCounts(counts) {
  const safeCounts = counts || {}
  let personalTotal = 0
  let groupTotal = 0

  Object.entries(safeCounts).forEach(([chatId, count]) => {
    const normalizedCount = Number(count) || 0
    const button = document.querySelector(`.chat-user-button[data-chat-id="${chatId}"]`)

    updateChatButtonUnread(chatId, normalizedCount)

    if (!button) return

    if (button.dataset.chatType === 'group' || button.closest('.group-chats')) {
      groupTotal += normalizedCount
    } else {
      personalTotal += normalizedCount
    }
  })

  updateSectionBadge('.personal-unread-badge', personalTotal)
  updateSectionBadge('.group-unread-badge', groupTotal)
  updateTotalBadge(personalTotal + groupTotal)
}

function updateSectionBadge(selector, count) {
  const badge = document.querySelector(selector)
  const badgeText = badge?.querySelector('span')

  if (!badge || !badgeText) return

  badgeText.textContent = count > 0 ? count : ''
  badge.style.display = count > 0 ? 'flex' : 'none'
}

  function clearUnread(chatId) {
  if (window.UnreadMessages?.updateChatButtonUnread) {
    window.UnreadMessages.updateChatButtonUnread(chatId, 0)
  }

  const counts = {}

  document.querySelectorAll('.chat-user-button[data-chat-id]').forEach(button => {
    const badge = button.querySelector('.chat-unread-count')
    const count = Number(badge?.textContent || 0)
    counts[button.dataset.chatId] = count
  })

  if (window.UnreadMessages?.applyUnreadCounts) {
    window.UnreadMessages.applyUnreadCounts(counts)
  } else {
    applyUnreadCounts(counts)
  }
}

  function sortChatsByLastMessage() {
    const list = document.querySelector('.chats-list')
    if (!list) return

    const items = Array.from(list.querySelectorAll('.chat-user-button'))

    items.sort((a, b) => {
      return Number(b.dataset.lastMessageTime || 0) - Number(a.dataset.lastMessageTime || 0)
    })

    items.forEach(item => list.appendChild(item))
  }

  function updateUserPresence(userId, isOnline) {
    document
      .querySelectorAll(`.status-indicator[data-user-id="${userId}"]`)
      .forEach(indicator => {
        indicator.classList.toggle('online', isOnline)
      })

    updateHeaderPresence(userId, isOnline)
  }

  function syncOnlineUsers(userIds) {
    const onlineIds = new Set((userIds || []).map(String))

    document.querySelectorAll('.status-indicator[data-user-id]').forEach(indicator => {
      indicator.classList.toggle('online', onlineIds.has(String(indicator.dataset.userId)))
    })

    updateCurrentHeaderFromList()
  }

  function updateCurrentHeaderFromList() {
  if (!state.currentChatId || !elements.chatStatus) return

  const currentButton = document.querySelector(`.chat-user-button[data-chat-id="${state.currentChatId}"]`)
  const userId = currentButton?.dataset.chatUser

  if (!userId) {
    if (elements.chatHeaderStatusIndicator) {
      elements.chatHeaderStatusIndicator.style.display = 'none'
      elements.chatHeaderStatusIndicator.removeAttribute('data-user-id')
      elements.chatHeaderStatusIndicator.classList.remove('online', 'offline')
    }
    return
  }

  updateHeaderStatusIndicator(userId)
}

 function updateHeaderPresence(userId, isOnline) {
  const currentButton = document.querySelector(`.chat-user-button[data-chat-id="${state.currentChatId}"]`)

  if (currentButton?.dataset.chatUser === String(userId)) {
    renderPersonalStatus(isOnline)

    if (elements.chatHeaderStatusIndicator) {
      elements.chatHeaderStatusIndicator.dataset.userId = String(userId)
      elements.chatHeaderStatusIndicator.style.display = ''
      elements.chatHeaderStatusIndicator.classList.toggle('online', isOnline)
      elements.chatHeaderStatusIndicator.classList.toggle('offline', !isOnline)
    }
  }
}
function renderPersonalStatus(isOnline) {
  if (!elements.chatStatus) return

  elements.chatStatus.innerHTML = `
    <span>${isOnline ? 'В мережі' : 'Не в мережі'}</span>
  `
}

 function isUserOnline(userId) {
  return window.Presence?.onlineUsers?.has(String(userId)) || false
}

function updateHeaderStatusIndicator(userId) {
  if (!elements.chatHeaderStatusIndicator || !userId) return

  const isOnline = isUserOnline(userId)

  elements.chatHeaderStatusIndicator.dataset.userId = userId
  elements.chatHeaderStatusIndicator.style.display = ''
  elements.chatHeaderStatusIndicator.classList.toggle('online', isOnline)
  elements.chatHeaderStatusIndicator.classList.toggle('offline', !isOnline)

  renderPersonalStatus(isOnline)
}

  async function openPersonalChat(userId, username, button) {
    const response = await fetch(`/chat/chat_with/${userId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCSRFToken(),
        'Content-Type': 'application/json',
      },
    })


    const data = await response.json()
    if (!data.success) return

  if (button) {
  button.dataset.chatId = data.chat_id
  button.dataset.chatUser = userId

  clearUnread(data.chat_id)
}

renderChat(data)
updateHeaderStatusIndicator(userId)
updateCurrentHeaderFromList()
    if (elements.chatHeaderStatusIndicator) {
  elements.chatHeaderStatusIndicator.removeAttribute('data-user-id')
  elements.chatHeaderStatusIndicator.classList.remove('online', 'offline')
}
    updateCurrentHeaderFromList()
  }


  async function openGroupChat(chatId) {
  const response = await fetch(`/chat/chat_open/${chatId}/`)
  const data = await response.json()

  if (!data.success) return

  clearUnread(data.chat_id)
  renderChat(data)

  if (elements.chatHeaderStatusIndicator) {
    elements.chatHeaderStatusIndicator.style.display = 'none'
    elements.chatHeaderStatusIndicator.removeAttribute('data-user-id')
    elements.chatHeaderStatusIndicator.classList.remove('online', 'offline')
  }

  if (elements.chatStatus) {
    const participants = Number(data.participants_count) || 0
    const online = Number(data.online_count) || 0

    elements.chatStatus.textContent = `${participants} учасники, ${online} в мережі`
  }
}

function updateUnreadBadge(chatId, count) {
  if (window.UnreadMessages?.updateChatButtonUnread) {
    window.UnreadMessages.updateChatButtonUnread(chatId, count)
  }
}

  function applyUnreadCounts(counts) {
  if (window.UnreadMessages?.applyUnreadCounts) {
    window.UnreadMessages.applyUnreadCounts(counts)
    return
  }

  Object.entries(counts || {}).forEach(([chatId, count]) => {
    updateUnreadBadge(chatId, Number(count) || 0)
  })


  let groupTotal = 0

  Object.entries(counts || {}).forEach(([chatId, count]) => {
    const button = document.querySelector(`.chat-user-button[data-chat-id="${chatId}"]`)

    if (button?.dataset.chatType === 'group') {
      groupTotal += Number(count) || 0
    }
  })

  const groupBadge = document.querySelector('.group-unread-badge')
  const groupBadgeText = groupBadge?.querySelector('span')

  if (groupBadge && groupBadgeText) {
    groupBadgeText.textContent = groupTotal > 0 ? groupTotal : ''
    groupBadge.style.display = groupTotal > 0 ? 'flex' : 'none'
  }
}

 function bindChatButtons() {
  document.querySelectorAll('.chat-user-button').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.chatType === 'group') {
        openGroupChat(button.dataset.chatId)
        return
      }

      if (button.dataset.chatUser) {
        openPersonalChat(button.dataset.chatUser, button.dataset.chatUsername, button)
        return
      }

      if (button.dataset.chatId) {
        openGroupChat(button.dataset.chatId)
      }
    })
  })
}

  function formatInitialSidebarTimes() {
      document.querySelectorAll('.message-time[data-time]').forEach(element => {
    const formattedTime = window.formatTime?.(element.dataset.time)

    if (formattedTime) {
      element.textContent = formattedTime
    }
      })
    }

  function init() {
      cacheElements()
      setChatActive(false)
      bindChatButtons()
      formatInitialSidebarTimes()
    }

  window.ChatUI = {
    state,
    elements,
    init,
    addMessage,
    updateChatPreview,
    applyUnreadCounts,
    clearUnread,
    syncOnlineUsers,
    updateUserPresence,
    scrollToBottom,
  }

  document.addEventListener('DOMContentLoaded', init)
})()