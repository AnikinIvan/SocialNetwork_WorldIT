function updateChatHeader(chatTitle, chatStatus, chatAvatar, headerData) {
  if (!headerData) return
  if (chatTitle && headerData.chat_name) {
    chatTitle.textContent = headerData.chat_name
  }

  if (chatStatus) {
    let statusHTML = ''

    const isGroup = Boolean(headerData.is_group)

    if (isGroup) {
      const participants = headerData.participants_count ?? 0
      const online = headerData.online_count ?? 0

      statusHTML = `${participants} учасники, ${online} в мережі`

      if (Array.isArray(headerData.online_users) && headerData.online_users.length > 0) {
        statusHTML += `: ${headerData.online_users.join(', ')}`
      }
    } else {
      const isOnline = Boolean(headerData.other_user_online)

      const icon = isOnline
        ? '/static/icons/logo/online-status.png'
        : '/static/icons/logo/offline-status.svg'

      const label = isOnline ? 'В мережі' : 'Не в мережі'

      statusHTML = `
        <img src="${icon}" alt="${label}" class="chat-status-icon">
        <span>${label}</span>
      `
    }

    chatStatus.innerHTML = statusHTML
  }

  if (chatAvatar && headerData.chat_name) {
    if (typeof getInitials === "function") {
      chatAvatar.textContent = getInitials(headerData.chat_name)
    } else {
      chatAvatar.textContent = headerData.chat_name.slice(0, 1).toUpperCase()
    }
  }
}