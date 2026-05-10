const input = document.getElementById('images-input');
const preview = document.getElementById('image-preview');

input.addEventListener('change', () => {
    preview.innerHTML = ""; // очистка старых

    const files = input.files;
    const btn = document.getElementById('choose-images');

    btn.addEventListener('click', () => {
        input.click();
    });
    for (let file of files) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('preview-img');

            preview.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
});