document.addEventListener('DOMContentLoaded', () => {
     const buttonModal = document.getElementById("open-modal")
     const modalPanel = document.getElementById("panel")

     if (buttonModal && modalPanel){
        buttonModal.addEventListener('click', () => {
            modalPanel.classList.remove('hidden');
            modalPanel.classList.add('panel');
        });
     }
})