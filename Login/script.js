let localhost = "https://localhost:7211/api/";
const popup = document.getElementById("pop-up");
const popupText = document.getElementById("pop-up-text");

function showPopup(text, type = "neg", timeout = 3000) {
    popupText.textContent = text;

    popup.classList.remove("pos", "neg", "active");
    popup.classList.add(type);
    requestAnimationFrame(() => {
        popup.classList.add("active");
    });
    setTimeout(() => {
        popup.classList.remove("active");
    }, timeout);
}
async function login_click(){
    document.getElementById("register-check").checked?await register(): await login()
}
async function login(){
    
    let login_elem = document.getElementById("login_text");
    let password_elem = document.getElementById("password_text");

    let login = login_elem.value;
    let password = password_elem.value;

    const url = localhost+"auth/login";
        try {
            const response = await fetch(url,{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    Login:login,
                    Password:password,
                })
            });
            if (!response.ok) {
                if(response.status === 401) showPopup("Invalid data for logging!","neg");
            }else{
                const result = await response.json();
                localStorage.setItem("jwt", result.token);
                showPopup("You logged into you accaount!","pos")
                login_elem.value = "";
                password_elem.value = "";
                window.location.replace("../Books/Books.html");
            }
            
            
        } catch (error) {
            showPopup("ERROR: "+error.message,"neg");
        }
    
}
async function register() {
    let login_elem = document.getElementById("login_text");
    let password_elem = document.getElementById("password_text");

    let login = login_elem.value;
    let password = password_elem.value;

    const url = localhost+"auth/register";
        try {
            const response = await fetch(url,{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    Login:login,
                    Password:password,
                })
            });
            if (!response.ok) {
                if(response.status === 409) showPopup(response.text(),"neg");
            }else{
                showPopup("You created account!","pos");
                document.getElementById("register-check").checked= false;
            }
    
            
        } catch (error) {
            showPopup("ERROR: "+error.message,"neg");
        }
}
async function me_click(){
    const url = localhost+"auth/me";
        try {
            const response = await fetch(url,{
                method:"GET",
                headers: {
                      "Authorization": "Bearer " + localStorage.getItem("jwt")
                    }
            });
            if (!response.ok) {
                showPopup("Invalid data for logging!","neg");
            }
    
            const result = await response.json();
            showPopup(result.username,"pos");

        } catch (error) {
            console.error(error.message);
        }
}
function register_change(){
    let elem = document.getElementById("register-check");
    document.getElementById("login-btn").value= elem.checked?"Register":"Login";
}