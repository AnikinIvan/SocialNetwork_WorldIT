document.addEventListener("DOMContentLoaded", function() {
    // --- Елементи модального вікна ---
    const modal = document.querySelector('#post-modal');
    const openBtn = document.querySelector('#open-modal-post');
    const closeBtn = document.querySelector('#close-modal-post');
    const form = document.querySelector('#create-post-forms, #post-create-form');
    
    // --- Допоміжні функції ---
    function getCSRFToken() {
        const token = document.querySelector("meta[name='csrf-token']");
        return token ? token.getAttribute("content") : "";
    }
    
    function renderErrors(errors) {
        // Спробуємо знайти контейнер для помилок
        let errorsContainer = document.getElementById("post-errors");
        
        // Якщо контейнера немає, створимо його перед формою
        if (!errorsContainer && form) {
            errorsContainer = document.createElement("div");
            errorsContainer.id = "post-errors";
            form.parentNode.insertBefore(errorsContainer, form);
        }
        
        if (errorsContainer) {
            errorsContainer.innerHTML = "";
            
            if (typeof errors === 'object') {
                for (const fieldName in errors) {
                    if (Array.isArray(errors[fieldName])) {
                        errors[fieldName].forEach((error) => {
                            const p = document.createElement("p");
                            p.textContent = typeof error === 'string' ? error : error.message || JSON.stringify(error);
                            errorsContainer.appendChild(p);
                        });
                    } else if (typeof errors[fieldName] === 'string') {
                        const p = document.createElement("p");
                        p.textContent = errors[fieldName];
                        errorsContainer.appendChild(p);
                    }
                }
            } else if (typeof errors === 'string') {
                const p = document.createElement("p");
                p.textContent = errors;
                errorsContainer.appendChild(p);
            }
        }
    }
    
    function clearErrors() {
        const errorsContainer = document.getElementById("post-errors");
        if (errorsContainer) {
            errorsContainer.innerHTML = "";
        }
    }
    
    // --- Функціонал додавання полів для посилань (з другого скрипта) ---
    const addLinkBtn = document.getElementById("add-link");
    if (addLinkBtn) {
        addLinkBtn.addEventListener("click", function() {
            const input = document.createElement("input");
            input.type = "url";
            input.name = "links";
            input.placeholder = "https://example.com";
            input.className = "link-input";
            
            const linksList = document.getElementById("links-list");
            if (linksList) {
                linksList.appendChild(document.createElement("br"));
                linksList.appendChild(input);
            }
        });
    }
    
    const chooseImagesBtn = document.getElementById("choose-images");
    const imagesInput = document.getElementById("images-input");
    if (chooseImagesBtn && imagesInput) {
        chooseImagesBtn.addEventListener("click", function() {
            imagesInput.click();
        });
    }

    // --- Відкриття/закриття модального вікна ---
    if (openBtn && modal) {
        openBtn.onclick = function() {
            clearErrors(); // Очищуємо помилки при відкритті
            modal.style.display = "flex";
        };
    }

    if (closeBtn && modal) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
            if (form) form.reset();
            clearErrors();
        };
    }
    
    // --- Закриття модального вікна при кліку поза ним ---
    if (modal) {
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
                if (form) form.reset();
                clearErrors();
            }
        };
    }
    
    // --- Відправка форми ---
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            clearErrors();
            
            const formData = new FormData(form);
            const action = form.action || window.location.href;
            
            fetch(action, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: formData
            })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                    throw data;
                }
                return data;
            })
            .then((data) => {
                console.log("Пост успішно створено!");
                
                if (modal) modal.style.display = "none";
                if (form) form.reset();
                
                // Використовуємо редирект з другого скрипта або перезавантажуємо сторінку
                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else {
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error("Помилка:", error);
                
                if (error && error.errors) {
                    renderErrors(error.errors);
                } else if (error && error.message) {
                    renderErrors(error.message);
                } else {
                    renderErrors("Сталася помилка при створенні поста. Спробуйте пізніше.");
                }
            });
        });
    }
});