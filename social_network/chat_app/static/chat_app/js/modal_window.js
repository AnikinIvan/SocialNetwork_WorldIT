document.addEventListener('DOMContentLoaded', () => {

    const buttonModalChat = document.querySelector(".create-chat")
    const modalChat = document.getElementById("select-members")
    const modalOverlay = document.querySelector('.modal-window')
    const closeModalChat = document.getElementById("close-select-members")

    const nextSelectMembers = document.getElementById('select-members-next')
    const cancelSelectMembers = document.getElementById('cancel-select-members')
    const newGroupModal = document.getElementById('new-group-modal')
    const closeNewGroupModal = document.getElementById('close-new-group-modal')
    const backToSelect = document.getElementById('group-modal-back')
    const memberCheckboxes = document.querySelectorAll('.group-member-checkbox')
    const selectedCount = document.querySelector('.selected-count')
    const groupMembersInput = document.getElementById('group-members-input')
    const groupMembersPreview = document.getElementById('group-members-preview')
    const searchInput = document.getElementById('group-search-input')
    const groupPhotoInput = document.getElementById('group-photo-input')
    const groupPhotoPreview = document.getElementById('group-photo-preview')
    const addPhotoButton = document.querySelector('.add-photo')
    const pickPhotoButton = document.querySelector('.pick-photo')

    const updateSelectedCount = () => {
        const count = Array.from(memberCheckboxes).filter(input => input.checked).length
        if (selectedCount) {
            selectedCount.textContent = `Вибрано: ${count}`
        }
    }

    const closeAllModals = () => {
        if (modalChat) {
            modalChat.classList.add('hidden')
            modalChat.classList.remove('select-members')
        }
        if (newGroupModal) {
            newGroupModal.classList.add('hidden')
        }
        if (modalOverlay) {
            modalOverlay.classList.add('hidden')
        }
    }

    const openSelectMembers = () => {
        if (modalChat) {
            modalChat.classList.remove('hidden')
            modalChat.classList.add('select-members')
        }
        if (newGroupModal) {
            newGroupModal.classList.add('hidden')
        }
        if (modalOverlay) {
            modalOverlay.classList.remove('hidden')
        }
    }

    const openNewGroupModal = () => {
        if (modalChat) {
            modalChat.classList.add('hidden')
            modalChat.classList.remove('select-members')
        }
        if (newGroupModal) {
            newGroupModal.classList.remove('hidden')
        }
        if (modalOverlay) {
            modalOverlay.classList.remove('hidden')
        }
    }

    const renderGroupPreview = () => {
        if (!groupMembersPreview || !groupMembersInput) return
        const selected = Array.from(memberCheckboxes).filter(input => input.checked)
        groupMembersInput.value = selected.map(input => input.value).join(',')
        groupMembersPreview.innerHTML = selected.map(input => {
            const memberName = input.closest('.member')?.querySelector('.name-member p')?.textContent || ''
            return `<div class="member"><img src="/static/chat_app/icons/NP.png" alt="${memberName}"><p>${memberName}</p></div>`
        }).join('')
    }

    if (Array.from(memberCheckboxes).length > 0) {
        memberCheckboxes.forEach(input => {
            input.addEventListener('change', () => {
                updateSelectedCount()
            })
        })
    }

    if (buttonModalChat && modalChat && modalOverlay) {
        buttonModalChat.addEventListener('click', () => {
            openSelectMembers()
            updateSelectedCount()
        });
    }

    if (closeModalChat && modalChat && modalOverlay) {
        closeModalChat.addEventListener('click', () => {
            closeAllModals()
        });
    }

    if (cancelSelectMembers) {
        cancelSelectMembers.addEventListener('click', () => {
            closeAllModals()
        })
    }

    if (nextSelectMembers) {
        nextSelectMembers.addEventListener('click', () => {
            renderGroupPreview()
            openNewGroupModal()
        })
    }

    const updateGroupPhotoPreview = (file) => {
        if (!groupPhotoPreview) return
        if (!file) {
            groupPhotoPreview.style.backgroundImage = ''
            groupPhotoPreview.innerHTML = '<span class="group-photo-initials">NG</span>'
            return
        }
        const reader = new FileReader()
        reader.onload = (event) => {
            groupPhotoPreview.style.backgroundImage = `url(${event.target.result})`
            groupPhotoPreview.innerHTML = ''
            groupPhotoPreview.classList.add('photo-selected')
        }
        reader.readAsDataURL(file)
    }

    if (addPhotoButton) {
        addPhotoButton.addEventListener('click', () => {
            groupPhotoInput?.click()
        })
    }

    if (pickPhotoButton) {
        pickPhotoButton.addEventListener('click', () => {
            groupPhotoInput?.click()
        })
    }

    if (groupPhotoInput) {
        groupPhotoInput.addEventListener('change', () => {
            const file = groupPhotoInput.files?.[0]
            if (file) {
                updateGroupPhotoPreview(file)
            }
        })
    }

    if (backToSelect) {
        backToSelect.addEventListener('click', () => {
            openSelectMembers()
        })
    }

    if (closeNewGroupModal) {
        closeNewGroupModal.addEventListener('click', () => {
            closeAllModals()
        })
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const value = searchInput.value.toLowerCase()
            document.querySelectorAll('#select-members-list .letter-group').forEach(group => {
                let anyVisible = false
                group.querySelectorAll('.member').forEach(member => {
                    const name = member.querySelector('.name-member p')?.textContent?.toLowerCase() || ''
                    const visible = name.includes(value)
                    member.style.display = visible ? 'flex' : 'none'
                    if (visible) anyVisible = true
                })
                group.style.display = anyVisible ? 'flex' : 'none'
            })
        })
    }

    updateSelectedCount()

})

// Функція для генерації ініціалів (наприклад, "Aeslie Alexander" -> "AA")
function getInitials(name) {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
}

// Головна функція створення та додавання користувача в список
function createAndAddMember(id, name) {
  const container = document.getElementById('users-container');
  if (!container) return;

  // 1. Створюємо головний контейнер рядка
  const memberRow = document.createElement('div');
  memberRow.className = 'member-row';
  memberRow.setAttribute('data-member-id', id);

  // 2. Створюємо блок з інформацією (аватар + ім'я)
  const memberInfo = document.createElement('div');
  memberInfo.className = 'member-info';

  // 3. Створюємо інтерактивний елемент завантаження аватарки
  const avatarLabel = document.createElement('label');
  avatarLabel.className = 'avatar-upload-label';
  avatarLabel.title = 'Завантажити фото';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.className = 'avatar-file-input';
  fileInput.accept = 'image/*';

  const avatarText = document.createElement('span');
  avatarText.className = 'avatar-preview-text';
  avatarText.textContent = getInitials(name) || 'NP';

  // Обробник завантаження картинки
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        // Видаляємо текст і старі зображення, якщо вони були
        const existingImg = avatarLabel.querySelector('img');
        if (existingImg) existingImg.remove();
        avatarText.style.display = 'none';

        // Створюємо та додаємо тег картинки
        const img = document.createElement('img');
        img.src = event.target.result;
        img.alt = 'Avatar';
        avatarLabel.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });

  // Збираємо аватарку докупи
  avatarLabel.appendChild(fileInput);
  avatarLabel.appendChild(avatarText);

  // 4. Створюємо текст імені
  const pName = document.createElement('p');
  pName.className = 'member-name';
  pName.textContent = name;

  // Складаємо блок інфо
  memberInfo.appendChild(avatarLabel);
  memberInfo.appendChild(pName);

  // 5. Створюємо кнопку-мусорку (через SVG для красивого вигляду)
  const trashButton = document.createElement('button');
  trashButton.type = 'button';
  trashButton.className = 'trash-button';
  trashButton.setAttribute('aria-label', 'Видалити');

  trashButton.innerHTML = `
    <svg class="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  `;

  // Обробник видалення елемента
  trashButton.addEventListener('click', function() {
    memberRow.style.opacity = '0';
    memberRow.style.transition = 'opacity 0.2s ease';
    setTimeout(() => {
      memberRow.remove();
      // Тут за потреби можна викликати функцію оновлення вашого прихованого інпуту з ID
    }, 200);
  });

  // 6. Збираємо весь рядок і додаємо в DOM
  memberRow.appendChild(memberInfo);
  memberRow.appendChild(trashButton);
  container.appendChild(memberRow);
}

// Приклад виклику функції (можна запускати в циклі для ваших даних)
document.addEventListener('DOMContentLoaded', () => {
  createAndAddMember('1', 'Aeslie Alexander');
  createAndAddMember('2', 'Nikita Petrenko');
});