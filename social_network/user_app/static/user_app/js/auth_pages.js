document.addEventListener('DOMContentLoaded', () => {
    const routes = {
        'link-register': 'form_register',
        'link-login': 'form_login',
        'email-link': 'form_confirm_email'
    };

    const allFormIds = ['form_register', 'form_login', 'form_confirm_email'];

    const navigateTo = (targetFormId) => {
        allFormIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = (id === targetFormId) ? 'block' : 'none';
            }
        });
    };

    document.addEventListener('click', (event) => {
        const clickedId = event.target.id;
        if (routes[clickedId]) {
            navigateTo(routes[clickedId]);
        }
    });
    navigateTo('form_register');
});