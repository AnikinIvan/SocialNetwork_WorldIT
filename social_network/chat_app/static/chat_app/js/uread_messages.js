(function () {
  function getUnreadBadge(button) {
    let badge = button.querySelector('.chat-unread-count')

    if (!badge) {
      badge = document.createElement('div')
      badge.className = 'chat-unread-count'
      button.querySelector('.avatar-wrapper')?.appendChild(badge)
    }

    return badge
  }

  function updateChatButtonUnread(chatId, count) {
    const button = document.querySelector(`.chat-user-button[data-chat-id="${chatId}"]`)

    if (!button) return

    const badge = getUnreadBadge(button)

    button.classList.toggle('has-unread', count > 0)
    badge.textContent = count > 0 ? count : ''
    badge.style.display = count > 0 ? 'flex' : 'none'
  }

  function updateSectionBadge(selector, count) {
    const badge = document.querySelector(selector)
    const badgeText = badge?.querySelector('span')

    if (!badge || !badgeText) return

    badgeText.textContent = count > 0 ? count : ''
    badge.style.display = count > 0 ? 'flex' : 'none'
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

      const isGroup = button.dataset.chatType === 'group' || button.closest('.group-chats')

      if (isGroup) {
        groupTotal += normalizedCount
      } else {
        personalTotal += normalizedCount
      }
    })

    updateSectionBadge('.personal-unread-badge', personalTotal)
    updateSectionBadge('.group-unread-badge', groupTotal)
  }

  function clearChatUnread(chatId) {
    updateChatButtonUnread(chatId, 0)
  }

  window.UnreadMessages = {
    applyUnreadCounts,
    clearChatUnread,
    updateChatButtonUnread,
  }
})()