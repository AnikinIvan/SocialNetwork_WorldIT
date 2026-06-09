const modalPanel = document.getElementById("modalPanel")
const openPanel = document.getElementById("open-panel")

if (modalPanel && openPanel){
    openPanel.addEventListener("click", () => {
        if (modalPanel.classList.contains("hidden")){
            modalPanel.classList.remove("hidden")
            modalPanel.classList.add("panel-edit")
        } else {
            modalPanel.classList.add("hidden")
            modalPanel.classList.remove("panel-edit")
        }
    })
}