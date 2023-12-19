const elementExists = (id) => document.getElementById(id) !== null;

elementExists("send") &&
    document.getElementById("send").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log("Datos enviados:", { username, password });

    fetch("/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        username,
        password,
        }),
    })
    .then(response=> response.json())
    .then (data =>{
        console.log(data)
        sessionStorage.setItem("cartId", data.cartID);
        if (data.message === "logged in") {
            
                console.log('Intentando redireccionar...')
                window.location.href = "/current"
            } else {
                alert("Credenciales incorrectas")
            }
        }
    )
    .catch((error) => console.error(error));
    });



elementExists("ingreso") &&
    document.getElementById("ingreso").addEventListener("click", function(){
        window.location.href="/login"
    })



elementExists("signup") &&
    document.getElementById("signup").addEventListener("click", function () {
        const first_name= document.getElementById("first_name").value;
        const last_name= document.getElementById("last_name").value;
        const email= document.getElementById("email").value;
        const password= document.getElementById("password").value;
        const age = document.getElementById("age").value;
        const rol ="user"
        const cartID =""




if(!first_name || !last_name|| !email||!password||!age){
    alert("Los campos estan incompletos")
}else {
    fetch("/signup", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        age,
        rol,
        cartID

    }),
    })
    .then((response) => {
        if (!response.ok) {
            console.log(response)
            throw new Error("Network response was not ok");
        }
        return response.json();
        })
        .then((data) => {
            console.log (data)
            if (data.message === "Usuario Creado"){
                window.location.href = "/login"
            }else {
                alert ("Credenciales Incorrectas")
            }
        }
        
    )}
    });


    elementExists("ver") &&
    document.getElementById("ver").addEventListener("click", function(){
        window.location.href="/products"
    })


    document.getElementById("forgot").addEventListener("click", function(){
        window.location.href="/forgot"
    })