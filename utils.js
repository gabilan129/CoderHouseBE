import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import { faker } from "@faker-js/faker"



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
    bcrypt.compareSync(password, user);

export default __dirname;


export const createNewProduct = () =>{
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.random.alphaNumeric,
        price:faker.random.numeric(),
        stock:faker.random.numeric(),
        category: faker.commerce.productAdjective(),
        status: true,
    }
}