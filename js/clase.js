/* 
async function pedirInfo() {
    const resp = await fetch("./productos.json")
    const productosDB = await resp.json()
    miPrograma(productosDB)
  }
  
  pedirInfo() */

    fetch("./productos.json")
    .then(resp => resp.json())
    .then(productosDB => miPrograma(productosDB))
    .catch(error => console.log(error)) 

  function miPrograma(productos) {
    let carrito = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
    // let carrito = JSON.parse(localStorage.getItem("carrito")) || []

    let contenedorProductos = document.getElementById("contenedorProductos")
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    let buscador = document.getElementById("buscador")
    let buscar = document.getElementById("buscar")
    buscar.onclick = filtrar

    let inputMin = document.getElementById("min")
    let inputMax = document.getElementById("max")

    let verCarrito = document.getElementById("verCarrito")
    verCarrito.addEventListener("click", mostrarOcultarCarrito)

    function mostrarOcultarCarrito() {
      contenedorProductos.classList.toggle("ocultar")
      contenedorCarrito.classList.toggle("ocultar")
    }

    renderizarProductos(productos)
    renderizarCarrito(carrito)

    function finalizarCompra() {
      localStorage.removeItem("carrito")
      carrito = []
      renderizarCarrito(carrito)

      mostrarSweetAlert('Gracias por su compra', 'BLABLABLA', 'success', 5000, false)
    }

    function filtrar() {
      let productosFiltrados
      if (buscador.value) {
        productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()) || producto.categoria.toLowerCase().includes(buscador.value.toLowerCase()))
      } else if (inputMin.value && inputMax.value) {
        productosFiltrados = productos.filter(producto => producto.precio > Number(inputMin.value) && producto.precio < Number(inputMax.value))
      }
      renderizarProductos(productosFiltrados)
    }

    function renderizarProductos(arrayDeProductos) {
      contenedorProductos.innerHTML = ""
      arrayDeProductos.forEach(({ id, nombre, precio, imgUrl: imagen, stock }) => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.classList.add("producto")
        tarjetaProducto.id = `tarjeta${id}`

        tarjetaProducto.innerHTML = `
        <h3>${nombre}</h3>
        <p>$${precio}</p>
        <img src=${imagen} />
        <button id=agregar${id}>Agregar al carrito</button>
      `
        if (stock < 10) {
          tarjetaProducto.classList.add("pocoStock")
          let pocasUnidades = document.createElement('p')
          pocasUnidades.innerText = "Quedan pocas unidades"
          tarjetaProducto.appendChild(pocasUnidades)
        }

        contenedorProductos.append(tarjetaProducto)

        let boton = document.getElementById("agregar" + id)
        boton.onclick = agregarAlCarrito
      })
    }

    function agregarAlCarrito(e) {

      console.log(e)
      let id = e.target.id.slice(7)
      console.log(id)
      let productoBuscado = productos.find(producto => producto.id == id)
      let productoEnCarrito = carrito.find(producto => producto.id == productoBuscado.id)

      // mostrarSweetAlert('Producto agregado','Se agregó el producto '+ productoBuscado.nombre, 'success', 2000, false, productoBuscado.imgUrl, '100px', '100px')

      Toastify({
        text: "Producto agregado",
        duration: 3000,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
      }).showToast();

      if (productoEnCarrito) {
        let posicionProducto = carrito.findIndex(producto => producto == productoEnCarrito)
        carrito[posicionProducto].unidades++
        carrito[posicionProducto].subtotal = carrito[posicionProducto].precio * carrito[posicionProducto].unidades
      } else {
        // tiene todas las propiedades de antes + unidades y subtotal
        productoBuscado.unidades = 1
        productoBuscado.subtotal = productoBuscado.precio
        carrito.push(productoBuscado)
      }

      // Storage y JSON
      localStorage.setItem("carrito", JSON.stringify(carrito))

      renderizarCarrito(carrito)
    }

    function renderizarCarrito(productosEnCarrito) {
      contenedorCarrito.innerText = ""
      productosEnCarrito.forEach(({ nombre, unidades, subtotal, id }) => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.classList.add("itemCarrito")
        tarjetaProducto.innerHTML += `
        <h3>${nombre}</h3>
        <p>${unidades}</p>
        <p>${subtotal}</p>
        <!-- <button id=eliminar${id}>Eliminar</button> -->
      `
        contenedorCarrito.appendChild(tarjetaProducto)
      })
      contenedorCarrito.innerHTML += `
      <button id="comprar">COMPRAR</button>
    `
      let comprar = document.getElementById("comprar")
      comprar.addEventListener("click", finalizarCompra)
    }

    let ropa = document.getElementById("ropa")
    ropa.onclick = filtrarPorCategoria

    function filtrarPorCategoria(e) {
      let productosFiltrados = productos.filter(({ categoria }) => categoria === e.target.id)
      renderizarProductos(productosFiltrados)
    }

    function mostrarSweetAlert(titulo, texto, icono, tiempo, mostrarBoton, urlImagen, anchoImagen, altoImagen) {
      Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        timer: tiempo,
        showConfirmButton: mostrarBoton,
        imageUrl: urlImagen,
        imageWidth: anchoImagen,
        imageHeight: altoImagen
      })
    }

  }

  // .json transforma Response en JS normal con la info que necesito
  /* fetch("https://jsonplaceholder.typicode.com/users")
    .then(respuesta => respuesta.json())
    .then(lista => console.log(lista))
    .catch(error => console.log(error))

  // EJEMPLO POST
  let config = {
    method: 'POST',
    body: JSON.stringify({
      title: 'Clase 15 JS',
      body: 'Post de prueba',
      userId: 1,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  }

  fetch("https://jsonplaceholder.typicode.com/users", config)
    .then(respuesta => respuesta.json())
    .then(objCreado => console.log(objCreado))
    .catch(error => console.log(error)) */