/*
En el archivo tarea2.js podemos encontrar un código de un supermercado que vende productos.
El código contiene 
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()​
*/


// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }
}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log("-------------------------------");
        console.log(`Agregando ${cantidad} unidades de ${sku}`);
        console.log("-------------------------------");

        try {
            // Busco el producto en la "base de datos"
            const producto = await findProductBySku(sku);
    
            console.log("-------------------------------");
            console.log("Producto encontrado:", producto);
            console.log("-------------------------------");
    
            const enCarro = this.productos.findIndex(prod=>prod.sku === producto.sku)
            if (enCarro >= 0) {
                if(producto.stock >= cantidad){
                    // Si ya está en el carro, aumento la cantidad
                    this.productos[enCarro].cantidad += cantidad
                    this.precioTotal = this.precioTotal + (producto.precio * cantidad);
                    productosDelSuper.find(prod=>prod.sku===sku).stock -= cantidad
                }else{
                    // Si el stock no alcanza para el pedido, no se agrega nada
                    console.log(`No se pudo agregar el pedido porque sólo quedan ${producto.stock} unidades de ${sku} en el super y se requieren ${cantidad} unidades`);
                }
            } else {       
                if(producto.stock >= cantidad){
                    // Creo un producto nuevo
                    const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
                    this.productos.push(nuevoProducto);
                    this.precioTotal = this.precioTotal + (producto.precio * cantidad);
                    if (!this.categorias.find(cat=>cat===producto.categoria))
                    this.categorias.push(producto.categoria); 
                    productosDelSuper.find(prod=>prod.sku===sku).stock -= cantidad   
                }else{
                    // Si el stock no alcanza para el pedido, no se agrega nada
                    console.log(`No se pudo agregar el pedido porque sólo quedan ${producto.stock} unidades de ${sku} en el super y se requieren ${cantidad} unidades`);
                }         
            }
            console.log(carrito);
        } catch (error) {
            console.log(error);
        }
    }

    async eliminarProducto (sku, cantidad) {
        
        console.log("-------------------------------");
        console.log(`Eliminando ${cantidad} unidades de ${sku}`);
        console.log("-------------------------------");
       
        // Busco en que lugar del carrito se encuentra el producto
        await findIndexBySku(sku, carrito.productos)
        .then(index=>{
            if (carrito.productos[index].cantidad > cantidad ) {
                // Elimino la cantidad pedida
                carrito.productos[index].cantidad -= cantidad
                // Descuento el precio
                carrito.precioTotal -= productosDelSuper.find(prod=>prod.sku===sku).precio * cantidad
            } else {       
                // Si la cantidad eliminada es mayor o igual a la que tenía, elimino el producto del carrito y descuento el precio correspondiente
                carrito.precioTotal -= productosDelSuper.find(prod=>prod.sku===sku).precio * carrito.productos[index].cantidad
                carrito.productos.splice(index, 1)   
            }
            console.log(carrito);
        }
        ).catch(error=>console.log(error))
    }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Producto ${sku} no encontrado`);
            }
        }, 1500);
    });
}

// Función que busca el indice de un producto por su sku en el carrito
function findIndexBySku(sku, cart) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = cart.findIndex(prod=>prod.sku === sku)
            if (index >= 0) {
                resolve(index);
            } else {
                reject(`Producto ${sku} no está en el carrito`);
            }
        }, 1500);
    });
}

// Instanciar carrito
const carrito = new Carrito();

// Función para llenar carrito (se agregan o eliminan uno por uno)
const llenarCarrito = async ()=>{
    await carrito.agregarProducto('WE328NJ', 2);
    await carrito.agregarProducto('WE328NJ', 3);
    await carrito.agregarProducto('XX92LKI', 4);
    await carrito.agregarProducto('FN312PPE', 3);
    await carrito.agregarProducto('FN312PP', 3);
    await carrito.agregarProducto('PV332MJ', 4);
    await carrito.eliminarProducto('WE328NJ', 1);
    await carrito.eliminarProducto('FN312PPE', 5);
    await carrito.agregarProducto('OL883YE', 7);

    console.log("************************************");
    console.log("CARRITO FINAL");
    console.log(carrito);
    console.log("************************************");
}

// Llamada a la función
llenarCarrito();

