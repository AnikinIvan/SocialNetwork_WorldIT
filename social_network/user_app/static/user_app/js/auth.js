function getCSRFToken(){
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content')
}

document.getElementById("register-form").addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST", 
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData  
        })
            .then(async (response) => {
                const data = await response.json()
                if (!response.ok){
                    throw data;    
                }
                return data
            })   
            .then((data)=>{
                console.log("Користувач успішно створений")
                const email = formData.get('email');
                document.getElementById('confirm-email').value = email;
                document.getElementById('user-email').textContent = email;
                navigateTo('email-link');
            })
            .catch((data)=>{
                if(data.errors){
                    console.log(data.errors)
                }
            })
            
        
    }
)

document.getElementById("login-form").addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST", 
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData  
        })
            .then(async (response) => {
                const data = await response.json()
                if (!response.ok){
                    throw data;    
                }
                return data
            })   
            .then((data)=>{
                console.log("Користувач успішно залогінився")
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            })
            .catch((data)=>{
                if(data.errors){
                    console.log(data.errors)
                }
            })
            
        
    }
)

document.getElementById("confirm-form").addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST", 
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData  
        })
            .then(async (response) => {
                const data = await response.json()
                if (!response.ok){
                    throw data;    
                }
                return data
            })   
            .then((data)=>{
                console.log("E-mail підтверджено")
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            })
            .catch((data)=>{
                if(data.message){
                    console.log(data.message)
                }
            })
            
        
    }
)