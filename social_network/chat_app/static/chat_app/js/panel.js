const buttonPanel = document.getElementById("open-panel")
const modalPanel = document.getElementById("panel")
const closePanel = document.getElementById("close-panel")

if (buttonPanel && modalPanel) { 
   buttonPanel.addEventListener('click', () => {
       if (modalPanel.classList.contains('hidden')){
           modalPanel.classList.remove('hidden'); 
           modalPanel.classList.add('panel');
        } else{
           modalPanel.classList.add('hidden'); 
           modalPanel.classList.remove('panel');
       }
   });
}

closePanel.addEventListener('click', () => {
     modalPanel.classList.add('hidden'); 
     modalPanel.classList.remove('panel');
})
