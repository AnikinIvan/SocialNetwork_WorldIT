function formatTime(value) {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })
}

function createDateDivider(dateString) {
  const divider = document.createElement('div')
  divider.className = 'message-date-divider'
  divider.textContent = formatDate(dateString)
  return divider
}

/**
 * @param {string} text
 * @param {boolean} isSelf
 * @param {string|null} createdAt
 * @param {string} senderName
 * @param {string[]} images
 * @param {boolean} isRead   
 * @param {number|null} messageId
 */
function createMessageBubble(text, isSelf = false, createdAt = null, senderName = '', images = [], isRead = false, messageId = null) {
  console.log('create bubble:', {
    text,
    isSelf,
    messageId,
    isRead,
  })

  const row = document.createElement('div')
  row.className = `message-row${isSelf ? ' self' : ' incoming'}`
  if (messageId) row.dataset.messageId = messageId

  const bubble = document.createElement('div')
  bubble.className = `chat-bubble${isSelf ? ' self' : ' incoming'}`

  if (images && images.length > 0) {
    const imgGrid = document.createElement('div')
    imgGrid.className = 'bubble-images'
    images.forEach(url => {
      const img = document.createElement('img')
      img.src = url
      img.className = 'bubble-image'
      img.alt = 'image'
      imgGrid.appendChild(img)
    })
    bubble.appendChild(imgGrid)
  }

  const contentRow = document.createElement('div')
  contentRow.className = 'bubble-content-row'

  if (!isSelf && senderName) {
    const nameEl = document.createElement('span')
    nameEl.className = 'bubble-sender'
    nameEl.textContent = senderName
    bubble.insertBefore(nameEl, bubble.firstChild)
  }

  if (text) {
    const textEl = document.createElement('span')
    textEl.className = 'message-text'
    textEl.textContent = text
    contentRow.appendChild(textEl)
  }

  const metaEl = document.createElement('span')
  metaEl.className = 'bubble-meta'

  if (createdAt) {
    const timeEl = document.createElement('span')
    timeEl.className = 'bubble-time'
    timeEl.textContent = formatTime(createdAt)
    metaEl.appendChild(timeEl)
  }

const tick = document.createElement('img')
tick.className = `see-indicator${isRead ? ' seen' : ''}`
tick.src = '/static/chat_app/icons/see_indicator.svg'
tick.alt = ''

if (messageId) {
  tick.dataset.messageId = String(messageId)
}

metaEl.appendChild(tick)

  contentRow.appendChild(metaEl)
  bubble.appendChild(contentRow)

  if (!isSelf) {
    const avatar = document.createElement('div')
    avatar.className = 'bubble-avatar'
    avatar.innerHTML = '<img src="/static/chat_app/icons/Jane Cooper.png" alt="avatar">'
    row.appendChild(avatar)
  }

  row.appendChild(bubble)
  return row
}

function markMessageSeen(messageId) {
  const tick = document.querySelector(`.see-indicator[data-message-id="${messageId}"]`)

  console.log('mark seen:', messageId)
  console.log('found tick:', tick)

  if (tick) {
    tick.classList.add('seen')
  }
}

window.markMessageSeen = markMessageSeen

function renderMessages(chatWindow, messages, currentUserId) {
  if (!chatWindow) return

  if (!messages || !Array.isArray(messages)) {
    chatWindow.innerHTML = ''
    return
  }

  chatWindow.innerHTML = ''
  let lastRenderedDate = null

  messages.forEach(message => {
    const currentDate = new Date(message.created_at).toDateString()

    if (currentDate !== lastRenderedDate) {
      chatWindow.appendChild(createDateDivider(message.created_at))
      lastRenderedDate = currentDate
    }

    const isSelf = message.sender_id === currentUserId
    const bubble = createMessageBubble(
  message.message || message.text || '',
  isSelf,
  message.created_at,
  message.sender_name,
  message.images || [],
  message.is_read || false,
  message.id || message.message_id || null
)
    chatWindow.appendChild(bubble)
  })

  chatWindow.scrollTop = chatWindow.scrollHeight
}

window.createMessageBubble = createMessageBubble
window.markMessageSeen = markMessageSeen
window.renderMessages = renderMessages
window.formatTime = formatTime