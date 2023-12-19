
import { faker } from "@faker-js/faker"
import { createNewProduct } from "../utils.js"

faker.locale="es"

export const createMockProducts = async (req, res) => {
    try {
        let products = []
        for (let i=0; i<100;i++){
            products.push(createNewProduct())
        }
        res.status(200).send(products)
    } catch (err) {
        res.status(500).send("error");
    }
}

export default createMockProducts
