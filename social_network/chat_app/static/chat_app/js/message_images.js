const messageImagesInput = document.querySelector("#messageImages")
const messageImageButton = document.querySelector("#messageImageButton")
const imagePreviewContainer = document.querySelector("#imagePreviewContainer")

function getSelectedImages() {
  return Array.from(messageImagesInput?.files || [])
}

function clearSelectedImages() {
  if (messageImagesInput) messageImagesInput.value = ""
  renderImagePreviews()
}

function getCSRFToken() {
  return (
    document.querySelector('meta[name="csrf-token"]')?.content ||
    document.querySelector('[name=csrfmiddlewaretoken]')?.value
  )
}

// Показывает превью выбранных файлов под инпутом
function renderImagePreviews() {
  if (!imagePreviewContainer) return

  imagePreviewContainer.innerHTML = ''
  const files = getSelectedImages()

  files.forEach((file, index) => {
    const url = URL.createObjectURL(file)

    const wrapper = document.createElement('div')
    wrapper.className = 'image-preview-wrapper'

    const img = document.createElement('img')
    img.src = url
    img.className = 'image-preview-thumb'
    img.onload = () => URL.revokeObjectURL(url)

    const removeBtn = document.createElement('button')
    removeBtn.type = 'button'
    removeBtn.className = 'image-preview-remove'
    removeBtn.textContent = '×'
    removeBtn.addEventListener('click', () => removeImageAt(index))

    wrapper.appendChild(img)
    wrapper.appendChild(removeBtn)
    imagePreviewContainer.appendChild(wrapper)
  })
}

// Удаляет одну картинку из выбранных по индексу
function removeImageAt(index) {
  const files = getSelectedImages()
  const dt = new DataTransfer()

  files.forEach((file, i) => {
    if (i !== index) dt.items.add(file)
  })

  if (messageImagesInput) messageImagesInput.files = dt.files
  renderImagePreviews()
}

async function sendMessageWithImages(chatId, text) {
  const formData = new FormData()
  formData.append("text", text)

  getSelectedImages().forEach(file => {
    formData.append("images", file)
  })

  const response = await fetch(`/chat/upload_images/${chatId}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken()
    },
    body: formData
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || !data) {
    console.error("Upload failed")
    return { success: false }
  }

  return data
}

if (messageImageButton && messageImagesInput) {
  messageImageButton.addEventListener("click", () => {
    messageImagesInput.click()
  })

  messageImagesInput.addEventListener("change", () => {
    renderImagePreviews()
  })
}

window.sendMessageWithImages = sendMessageWithImages
window.clearSelectedImages = clearSelectedImages
window.getSelectedImages = getSelectedImages