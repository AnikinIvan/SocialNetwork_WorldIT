const modalFriends = document.getElementById("modalFriends")
const openModalWindow = document.getElementById("open-modale-window")

if (modalFriends  && openModalWindow){
    openPanel.addEventListener("click", () => {
        if (modalPanel.classList.contains("hidden")){
            modalPanel.classList.remove("hidden")
            modalPanel.classList.add("confirm-action")
        } else {
            modalPanel.classList.add("hidden")
            modalPanel.classList.remove("confirm-action")
        }
    })
}
