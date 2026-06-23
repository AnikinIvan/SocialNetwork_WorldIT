function renderSelectedMembers(groupMembersPreview, membersInput) {
  if (!groupMembersPreview) return
  const ids = getSelectedMemberIds(membersInput)
  
  const byId = new Map()
  document.querySelectorAll('#select-members .member p, #select-members .name-member p, #group-members-preview .member p').forEach(p => {
    const parent = p.closest('.member')
    const checkbox = parent?.querySelector('input.group-member-checkbox')
    if (checkbox) byId.set(String(checkbox.value), p.textContent.trim())
  })

  groupMembersPreview.innerHTML = ids.map(id => {
    const nickname = byId.get(String(id)) || id
    const initials = getInitials(nickname) 
    const groupTrashIconSrc = '/static/chat_app/icons/garbage.svg'

    return `
      <div class="member-row-item" data-member-id="${id}">
        <div class="member-info-block">
          <div class="member-avatar-circle">${initials}</div>
          <p class="member-fullname">${nickname}</p>
        </div>
        <button type="button" class="remove-member" aria-label="remove" data-member-id="${id}">
          <img src="${groupTrashIconSrc}" alt="Видалити" />
        </button>
      </div>
    `
  }).join('')
}

function initGroupMemberManagement() {
  const groupMembersPreview = document.getElementById('group-members-preview')
  const groupMembersInput = document.getElementById('group-members-input')

  renderSelectedMembers(groupMembersPreview, groupMembersInput)

  if (groupMembersPreview) {
    groupMembersPreview.addEventListener('click', (e) => {
      const btn = e.target.closest('.remove-member')
      if (!btn) return
      const id = String(btn.dataset.memberId || btn.getAttribute('data-member-id') || '')
      if (!id) return

      const ids = getSelectedMemberIds(groupMembersInput).filter(x => String(x) !== id)
      setSelectedMemberIds(groupMembersInput, ids)
      renderSelectedMembers(groupMembersPreview, groupMembersInput)
    })
  }
}

function initGroupPhotoPreview() {
  const groupPhotoInput = document.getElementById('group-photo-input');
  const groupPhotoPreview = document.getElementById('group-photo-preview');

  if (groupPhotoInput) {
    groupPhotoInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          groupPhotoPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const addPhotoBtn = document.getElementById('group-add-photo-btn');
  const pickPhotoBtn = document.getElementById('group-pick-photo-btn');

  if (addPhotoBtn) {
    addPhotoBtn.addEventListener('click', () => groupPhotoInput.click());
  }
  if (pickPhotoBtn) {
    pickPhotoBtn.addEventListener('click', () => groupPhotoInput.click());
  }
}