
import fs from 'fs';

class ProductManager {
    constructor(path) {
    this.path = path;
    this.products = this.readFile();
    }

    readFile() {

        try {
        
        const data = JSON.parse(fs.readFileSync(`./${this.path}`, "utf-8"));
        
        return data;
        
        } catch (error) {
        
        return []
        
        }
        
        }

    writeData(data) {
    let dataString = JSON.stringify(data);
    fs.writeFileSync(`./${this.path}`, dataString);
    }


    addProducts(product) {     
        
        //Creo la variable utilizando this.readfile
        let listado = this.readFile();
        const checkInCart = listado.find(p => p.code === product.code)

        if (!product.title 
            // || !product.description || !product.price ||
            
            // !product.status|| !product.code || !product.stock || !!product.category
            ) {
                
                throw new Error('Todos los campos son obligatorios'); 
            } else if (checkInCart){
                console.log("ERROR - Please check the information and try again")
            }
        else {
            
            
            product.id = listado.length > 0 ? listado[listado.length - 1].id + 1 : 1;
            listado.push(product)
            this.writeData(listado)
        }
    }

    getProducts () {
        try {
        
            const data = JSON.parse(fs.readFileSync(`./${this.path}`, "utf-8"));
            
            return data;
            
            } catch (error) {
            
            return []
            
            }
            
            }


// const isInCart = (id) => { return products.find (product =>product.title ===title) }


getProductsById (id){

    const products = this.readFile();

const search = products.find(product => product.id === id) 

if (search == undefined) {
console.log( "Product not found")
}
else {

return search 
}
}

isInProducts  (title)  {
    products.find (prod => prod.title === title)
}




updateProduct(id, product){

    let data = this.readFile ();
    if(data.find(product=>product.id===id)){
        let productDeleted = data.filter(product => product.id!==id)
        product.id=id;
        productDeleted.push(product);
        this.writeData(productDeleted);
        return productDeleted;

    }
    else{
        console.log('The product to be updated does not exist')
    }
}


async deleteProduct (id){
    let productos = await  this.readFile() 
    try {
    productos = productos.filter (producto =>producto.id != id )
    this.writeData(productos)
        
    } catch (err) {
        console.log("Oops! There has been a mistake")
    }
}

deleteAll(){
    this.writeFile([])
}
}

const newProd = new ProductManager('./database/productos.JSON');

module.exports = {newProd}
module.exports=ProductManager


