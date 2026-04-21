function getCSRFToken(){
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content')
}
console.log(getCSRFToken())

document.querySelector('.form-register form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const foemData = $(form).serialize();

    $.ajax({
        url: '/auth/register/',
        type: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken()
        },
        data: foemData,
        success: function(response) {
            alert("Формф регистрации отправлена")
        },
        error: function(xhr){
            alert('Ошибфка сервера: '+ xhr.responseText);
        }
    });
});

document.querySelector('.form-login form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const foemData = $(form).serialize();

    $.ajax({
        url: '/auth/login/',
        type: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken()
        },
        data: foemData,
        success: function(response) {
            alert("Формф логина отправлена")
        },
        error: function(xhr){
            alert('Ошибфка сервера: '+ xhr.responseText);
        }
    });
});

document.querySelector('.form-confirm form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const foemData = $(form).serialize();

    $.ajax({
        url: '/auth/confirm/',
        type: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken()
        },
        data: foemData,
        success: function(response) {
            alert("Формф подтвердения отправлена")
        },
        error: function(xhr){
            alert('Ошибфка сервера: '+ xhr.responseText);
        }
        
    });
});

document.getElementById('back').addEventListener('click', function(){
    $('.form-confirm').hide();
    $('.form-register').show();
})