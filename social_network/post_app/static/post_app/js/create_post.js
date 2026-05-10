import { renderErrors } from "../../../../static/js/renderErrors.js"

document.getElementById('show-modal-create').addEventListener(
    'click',
    function (){
        document.querySelector(".modal-create-post").style.display = 'flex'
    }
)
document.querySelector('.close-modal').addEventListener(
    'click',
    function (){
        document.querySelector(".modal-create-post").style.display = 'none'
    }
)
function getCSRFToken(){
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content')
}
// 
document.getElementById('add-link').addEventListener(
    'click',
    function (){
        const input =  document.createElement('input')
        input.type = 'url'
        input.name = 'links'
        input.placeholder = 'https://www.instagram.com/world.it.academy'

        document.getElementById('links-list').appendChild(document.createElement('br'))
        document.getElementById('links-list').appendChild(input)
    }
)
// 
document.getElementById('post-create-form').addEventListener(
    'submit',
    function (event){
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)

        fetch(form.action, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
        .then(async response => {
            const data = await response.json()
            if (!response.ok) {
                throw data
            }
            return data
        })
        .then(data => {
            if (data.redirect_url){
                window.location.href = data.redirect_url
            }
        })
        .catch(data => {
            if(data.errors){
                renderErrors("create-errors", data.errors)
            }
        })
    }
)
