document.getElementById('userDetailsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/';
        } else {
            Object.entries(data.errors).forEach(([field, errors]) => {
                const el = document.querySelector(`.id_${field}_error`);
                if (el) el.textContent = errors[0].message;
            });
        }
    });
});