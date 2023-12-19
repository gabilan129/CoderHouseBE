const paragraph = document.getElementById('paragraph')
const input = document.getElementById('input')

const socket = io("/viewsRouter");

//Listeners
input.addEventListener('keyup', (event)=>{
    let  newProductToAdd = event.target.value 
    if (event.key === "Enter" ){
        if (input.value.trim().length){
        socket.emit('message', newProductToAdd);
    }
    input.value =""
    }
})

//Emitter
socket.on("paragraph", data =>{
    let html = data.map ( (product) => {
        return `<span>Producto: ${product.title}</span>`
    })
    paragraph.innerHTML=html
})