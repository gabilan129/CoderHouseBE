import fs from 'fs';


const productosDB = JSON.parse(fs.readFileSync('./database/productos.JSON', 'utf-8'))


export const returnProducts = (req, res) => {
    const {limit} = req.query

    if (limit) return res.json(productosDB.slice(0,limit))
    else return res.json(productosDB)
}

export const productFound = (req, res) => {

    const {pid} = req.params 
    const producto = productosDB.find((product) => product.id === pid);

    res.status(200).json({
        message: 'Producto Encontrado',
        producto
        })
}

export const postProduct = (req, res) => {

    let producto = req.body
    let id = producto.length > 0 ? producto[producto.length - 1].id + 1 : 1

    let productoNuevo = { id, ...producto}
    if (productoNuevo) {

        productosDB.push(productoNuevo)
        fs.writeFileSync('./database/productos.JSON', JSON.stringify(productosDB))
        
        return res.status(200).json(
            {
                message: 'Producto Agregado', 
                productoNuevo
            });        
    }  else {
        res.status(400).json({
            message: 'Error'
        });
    }
}

export const updateProduct=(req, res) =>{
    // Usar params y body
    const {pid} = req.params 
    const body = req.body

    if(productosDB.find(product=>product.id===pid)){
        let productDeleted = productosDB.filter(product => product.id!==pid)
        let producto = req.body
        let id = producto.length > 0 ? producto[producto.length - 1].id + 1 : 1  
        let productoNuevo = { id:pid, ...producto}
        productDeleted.push(productoNuevo);
        this.writeFileSync(productDeleted);
        res.send(productDeleted, "Producto Actualizado");

    }
    else{
        console.log('El producto no existe')
    }
}

export const deleteProduct = (req, res) =>{

    // Usar params para el id
    const {pid} = req.params 
  
    if (pid) { 
    productosDB = productosDB.filter (producto =>producto.id != pid )
    this.writeFileSync(productosDB)
    res.send ("El Producto ha sido eliminado")
    } else {
    res.status(404).send("El producto no existe")
}
}