import fs from 'fs';

const cartDB = JSON.parse(fs.readFileSync('./database/cart.JSON', 'utf-8'))

export const cartLogic = (req, res) => {
 
      let cart = {
        id: cartDB.length == 0 ? 1 : cartDB.length + 1,
        product: []
      }
  
      cartDB.push(cart)
      fs.writeFileSync('./database/cart.JSON', JSON.stringify(cartDB));
  
      res.send("Carrito creado");
  }

  export const cartSearch = (req, res) => {
    const carritoId = req.params.cid;

    const searchInCart = cartDB.find(product => product.id === Number(req.params.cid)) 

    if (searchInCart == undefined) {
      console.log( "Product not found")
    }
    else {

      res.send(searchInCart)  
    }
}

export const addAlCart = (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
  // agregar el producto al carrito
    productoId.push(carritoId)


    const productPost = 
    {
        'id': productoId,
        'quantity': 1
    }

    const checkInCart = cartDB.find(p => p.id === +carritoId)

    //Verificar si el id devuelve checkInCart coincide con el productPost
    const verify1 = checkInCart.products.find(product=>product.id===productPost.id)

    //Verificar si hay un producto que coincida con productoId para luego sumar la cantidad si existe
    
    const verify2 = checkInCart.products.find(product=>product.id === productoId)

    //Un if de que en el caso que exista productoId, sumarle la cantidad sino pushear productoPost
    if(verify1) {

      verify2.quantity++

    } else {

      checkInCart.products.push(productPost)

    }

    //Luego escribir en el cart.json con fs pasandole el cartDb

    fs.writeFileSync('./database/cart.JSON', JSON.stringify(cartDB));


    //Enviar por res una respuesta
    res.send("Producto Agregado")
    

};
