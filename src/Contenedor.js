const fs = require('fs')

class Contenedor{

    constructor(ruta) {
        this.ruta = ruta
    }

    async saveCommun(array = []) {
        try {
            const jsonElem = JSON.stringify(array, null, 2)
            await fs.promises.writeFile(this.ruta, jsonElem)
        } catch (error){
            console.log(error);
        }
    }

    async read() {
        try {
            const json = await fs.promises.readFile(this.ruta)
            return JSON.parse(json)
            
        } catch (error) {
            return []
        }
    }

    async save(elem) {
        let numid
        const array = await this.read()
        if(array.length == 0) {
            elem.id = array.length + 1
        }else{
            numid = array[array.length - 1].id + 1
            elem.id = numid
        } 
        array.push(elem)
        await this.saveCommun(array)
        return numid
    }

    async getById(number){
        let object = null;
        const array = await this.read()
         array.forEach(element => {
            if(element.id == number){
                object = element
            }
        });
        return object
    }

    async getAll() {
        return await this.read()
    }

    async deleteById(number) {
        const array = await this.read()
        array.forEach((element, i) => {
            if(element.id == number){
                array.splice( i, 1 );
            }
        });
        await this.saveCommun([])
        await this.saveCommun(array)
    }

    async deleteAll(){
        await this.saveCommun([])
    }

    async saveElementID(elem, idex) {
        const array = await this.read() 
        array[idex] = elem
        await this.saveCommun(array)
        return 
    }

}

module.exports = Contenedor