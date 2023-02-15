fetch('./js/data.json')
        .then((resp)=>resp.json())
        .then((helados_extraccion)=>{programa(helados_extraccion)})
        .catch((error)=>console.log(error))

function programa(helados){
        
    let carrito = [];
    let sub_total =[];
    let total ;
    let filtrados ="";
    let filtro_check=[];
    let busqueda = "";
    let contenedor_principal = document.getElementById("contenedor_principal");

    let input_buscar_html = document.getElementById("input_buscar");
    input_buscar_html.oninput  = visualisacion_limpiar
    input_buscar_html.onchange = realizar_busqueda

    let contenedor_carrito_js =document.getElementById("contenedor_carrito");
    contenedor_carrito_js.onclick = click_fuera

    let boton_buscar_js = document.getElementById("boton_buscar");
    boton_buscar_js.onclick = realizar_busqueda;

    let mostrar_carrito =document.getElementById("mostrar_carrito");
    mostrar_carrito.onclick =  visualisacion_carrito;

    let limpiar_busqueda = document.getElementById("limpiar_busqueda");
    limpiar_busqueda.onclick = limpiesa_input;

    let check_categorias = document.getElementsByClassName("categorias");
    for(const check_categoria of check_categorias){//para esuchar todos los click de ccategorias(tambien esta hecho con query selllector)
        check_categoria.onclick = filtrado_check;
    };

    let check_precios_bajos = document.getElementById("bajo_alto");
    check_precios_bajos.onclick = filtrado_precios_bajos;

    let check_precios_altos = document.getElementById("alto_bajo");
    check_precios_altos.onclick = filtrado_precios_altos;

    //Funciones*******************************************************************************************************************************************************

    function mostrar_producto(productos){//funtion para crear caja contenedores de productos
        contenedor_principal.innerHTML = "";
        productos.forEach(({id,categoria,img,sabor,descripcion,precio})=>{
            let contenedor_producto = document.createElement("article");
            contenedor_producto.className = "articulo_contedor";
            let color_informacion ;
            if(categoria == "chocolates"){
                color_informacion = "chocolate";
            }else if(categoria == "dulce de leches"){
                color_informacion = "dulce_leche";
            }else if(categoria == "cremas"){
                color_informacion = "crema";
            }else if(categoria == "frutas a la crema"){
                color_informacion = "frutas_a_la_crema";
            }else if(categoria == "frutas al agua"){
                color_informacion = "fruta_agua";
            }else if(categoria == "sambayones"){
                color_informacion = "sambayon";
            };
            contenedor_producto.innerHTML = `
                    <img src=${img}>
                    <div class="informacion ${color_informacion}">
                        <h3 class="productos">${sabor}</h3>
                        <p > 
                            ${descripcion}
                        </p>
                        <div>
                            <h4>$${precio}
                            </h4>
                            <button class="boton_agregar" id=elimnar${id}>Agregar al carrito</button>
                        </div>
                    </div>
                `;
            contenedor_principal.appendChild(contenedor_producto);  
        });


        let boton_agregar_carrito = document.querySelectorAll(`.boton_agregar`);//otra forma de seleccionar todo las clases
        boton_agregar_carrito.forEach((el)=>el.onclick =agregar_carrito);//otra forma de esuchar el evento

        if(localStorage.getItem("producto_usuario") != null){
            carrito = JSON.parse(localStorage.getItem("producto_usuario"));
            renderisado_carrito();
            mostrar_carrito.innerHTML=`<img class="carrito" src="./img/carrito_left.png" alt=""> <p class="cantidad_carrito">${carrito.length}</p>`;
        }else{
            mostrar_carrito.innerHTML=`<img class="carrito" src="./img/carrito_left.png" alt="">`;
            localStorage.clear();
            renderisado_carrito();
        }
        
        if(contenedor_principal.innerHTML == ""){
            contenedor_principal.innerHTML = `<p >producto no encontrado</p>`;
        } 
    }

    mostrar_producto(helados);   
    function limpiesa_input(){
        busqueda = "";
        input_buscar_html.value = "";
        filtro_check == "" ? mostrar_producto(helados): filtrado_check();
    /*      if(filtro_check == ""){
            mostrar_producto(helados);
            }else{
                filtrado_check();
            } */
            limpiar_busqueda.classList.toggle("ocultar_x")
    }

    function visualisacion_limpiar(){
        if(input_buscar_html.value!="") {
            if(limpiar_busqueda.className.includes("ocultar_x")){
                limpiar_busqueda.classList.toggle("ocultar_x") 
            }     
        }else{
            limpiar_busqueda.classList.toggle("ocultar_x") 
        }
    }

    function realizar_busqueda(){
        filtrados = "";
        busqueda = input_buscar_html.value.toLowerCase();
        filtrados = helados.filter(({categoria,sabor,descripcion})=>
            categoria.toLowerCase().includes(busqueda)
            || sabor.toLowerCase().includes(busqueda)
            || descripcion.toLowerCase().includes(busqueda));
            filtro_check=="" ? mostrar_producto(filtrados): filtrado_check();
    /*      if(filtro_check==""){
            mostrar_producto(filtrados);
            }else{
            filtrado_check();
            };  */
    }
    function visualisacion_carrito(){//muestra o oculta lo contenido en carrito
        let quitar_scroll = document.body
        quitar_scroll.classList.toggle("quitar_scroll")
        contenedor_carrito_js.classList.toggle("mostrar");
        contenedor_carrito_js.classList.toggle("ocultar");

        
        if(contenedor_carrito_js.className.includes("mostrar")){
            if(carrito.length != 0){
                    mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> <p class="cantidad_carrito">${carrito.length}</p>`;
                }else{
                    mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> `;
                }  
        }
        if(contenedor_carrito_js.innerText ==""){
            contenedor_carrito_js.innerHTML =`
                <section id="sub_contenedor"> 
                    <img id="cerrar_carrito" src="./img/close.png" alt="cerrar">
                    <img class="img_sin_articulo" src="./img/agregado.png" alt="sin artuculos">
                    <p class="text_sin_articulo">No tiene articulos en su carrito </p>
                </section>
            `   
        }
    };
    function renderisado_carrito(){
        sub_total = [];
        contenedor_carrito_js.innerHTML = "";
        carrito.forEach(({cantidad,precio})=>sub_total.push(cantidad*precio));
        total = sub_total.reduce((a,el)=> a + el,0);
        carrito.forEach(({id,sabor,cantidad,img,precio})=> contenedor_carrito_js.innerHTML +=`
                <article class="articulo_carrito">
                    <img class="img_carrito" src=${img}>
                    <div class="info_articulo">
                        <p class="sabor_carrito"> ${sabor} </p>
                        <div class="accion_carrito">
                            <div >
                                <button  class ="class_boton_restar" id=restar${id}>- </button>   
                                <span> ${cantidad} </span>
                                <button  class ="class_boton_agregar" id=sumar${id}> + </button> 
                            </div>
                            <button class="botones_quitar" >
                                <img id=quitar${id}  src="./img/elminar.png" alt="eliminar">
                            </button>
                        </div>
                    </div>
                    <p class="sub_total">$${cantidad * precio} </p>
                </article>
            `
        );
        if(carrito!=""){
            contenedor_carrito_js.innerHTML =`
                    <section id="sub_contenedor"> 
                        
                        <img id="cerrar_carrito" src="./img/close.png" alt="cerrar">
                        <h2>
                            Mis Artículos
                        </h2>
                        <div class="contendor_articulos">
                            ${contenedor_carrito_js.innerHTML}
                        </div>
                        <div class="total_compra">
                                <button  id=finalizar_compra>Finalizar comprar</button>
                                <span> Total =</span>
                                <span>$${total} </span>
                            </div>
                    </section>
                `;
            
            let cerrar_carrito = document.getElementById("cerrar_carrito")
            let botones_sumar = document.querySelectorAll(`.class_boton_agregar`); 
            let botones_restar = document.querySelectorAll(`.class_boton_restar`);    
            let botones_eliminar_articulos = document.querySelectorAll(`.botones_quitar`);
            let finalizado_compra = document.getElementById("finalizar_compra");

            cerrar_carrito.onclick = visualisacion_carrito;
            botones_sumar.forEach((el)=>el.onclick = sumar_cantidad);
            botones_restar.forEach((el)=>el.onclick = restar_cantidad);
            botones_eliminar_articulos.forEach((el)=>el.onclick =elminar_articulo);
            finalizado_compra.onclick = envio_info;

            localStorage.setItem("producto_usuario",JSON.stringify(carrito));

            mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> <p class="cantidad_carrito">${carrito.length}</p>`;

        }else{
            contenedor_carrito_js.innerHTML =`
                    <section id="sub_contenedor"> 
                        <img id="cerrar_carrito" src="./img/close.png" alt="cerrar">
                        <img class="img_sin_articulo" src="./img/agregado.png" alt="sin artuculos">
                        <p class="text_sin_articulo">No tiene articulos en su carrito </p>
                    </section>
                ` 
            mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> <p class="cantidad_carrito">`;
            let cerrar_carrito = document.getElementById("cerrar_carrito");
            cerrar_carrito.onclick = visualisacion_carrito;
        }   
    };

    function click_fuera(e){
        if(e.target.id == "contenedor_carrito"){
            visualisacion_carrito()
        }
    }

    function filtrado_precios_altos(){
        if(check_precios_altos.checked){
            helados.sort((x, y) => y.precio - x.precio);
            check_precios_bajos.checked=false     
        }else{
            helados.sort((x, y) => x.id - y.id);
        }
        filtrado_check()
    }

    function filtrado_precios_bajos(){
        if(check_precios_bajos.checked){
            check_precios_altos.checked=false
            helados.sort((x, y) => x.precio - y.precio);
        }else{
            helados.sort((x, y) => x.id - y.id);
        }
        filtrado_check()
    }

    function filtrado_check(){//funcion para chekear si check box esta selecionado o no(true o false)
        filtro_check=[];
        let busqueda_con_check = "";
        function if_bajo_alto(){
            if(check_precios_bajos.checked){
                check_precios_altos.checked=false;
                filtrados.sort((x, y) => x.precio - y.precio);
            }else if(check_precios_altos.checked){
                check_precios_bajos.checked=false;
                filtrados.sort((x, y) => y.precio - x.precio);
            }else{
                filtrados.sort((x, y) => x.id - y.id);
            }

        }
        for(const check_categoria of check_categorias){
            check_categoria.checked && filtro_check.push(check_categoria.id);
    /*         if(check_categoria.checked){
                filtro_check.push(check_categoria.id);
            }; */
        };
        if(busqueda ==""){
            filtrados = helados.filter(({categoria})=>filtro_check.includes(cambio_espacios(categoria)));
            filtro_check=="" ? mostrar_producto(helados):mostrar_producto(filtrados);
    /*         if(filtro_check==""){
                mostrar_producto(helados);
            }else{
                mostrar_producto(filtrados);
            }; */
        }else{
            if(filtro_check==""){
                if_bajo_alto()
                mostrar_producto(filtrados);
                
            }else{
                if_bajo_alto()
                busqueda_con_check = filtrados.filter(({categoria})=>filtro_check.includes(cambio_espacios(categoria)));
                mostrar_producto(busqueda_con_check);       
            }
        }
    };

    function extractor_numero(cadena){//function para extrar el numeros de las clase creadas con js para comparar con los id de array helados
        let id_obtenido ="";
        for(i=0; i<cadena.length; i++){
            if(isNaN(cadena[i]) == false){
                id_obtenido = id_obtenido + cadena[i]
            };
        };
        return id_obtenido;
    };

    function cambio_espacios(cadena){//function para cambiar el espacio por "_" para comparar las id asociadas a las class categorias de el html con las categorias de helados
        let resultado ="";
        for(i=0; i<cadena.length; i++){
            cadena[i] == " " ? resultado += "_": resultado += cadena[i]; 
    /*          if(cadena[i]==" "){
                resultado +="_";
            }else{
                resultado += cadena[i];
            }  */
        }
        return resultado;   
    }

    function agregar_carrito(e){
        let id_extraido = Number(extractor_numero(e.target.id));
        let indice = carrito.indexOf(carrito.find(({id})=>id==id_extraido));

        if(carrito.find(({id})=> id == id_extraido)){
            carrito[indice].cantidad++ ;
        }else{ 
            carrito.push(helados.find(({id})=>id==id_extraido));
            carrito[carrito.length-1].cantidad = 1;
        }
        renderisado_carrito();
        limpiar_busqueda.classList.toggle("ocultar_x")
        
        console.log(id_extraido)
        console.log(indice) 
        console.log(carrito)
        console.log(helados[id_extraido-1].sabor)
        
        Toastify({
            text:  `Se a agregado un helado sabor ${helados[id_extraido-1].id} ${helados[id_extraido-1].sabor} `,
            //${carrito[id_extraido-1].sabor}
            duration: 2000,
            //destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            className: "toastify_estilo",
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #ff006a, #eb60df)",
            },
            onClick: function(){} // Callback after click
        }).showToast();
    }

    function elminar_articulo(e){
        console.log(e.target.id)
        contenedor_carrito_js.innerText ="";
        let id_extraido = Number(extractor_numero(e.target.id));
        let a_eliminar = carrito.indexOf(carrito.find(({id})=>id_extraido== id));
        carrito.splice(a_eliminar,1);
        if(carrito.length ==  0){
            localStorage.clear();
            contenedor_carrito_js.innerText ="";
        }
        renderisado_carrito();
    }

    function restar_cantidad(e){
        console.log(e.target.id)

        contenedor_carrito_js.innerText ="";
        let id_extraido = Number(extractor_numero(e.target.id));
        if(carrito.find(({id})=> id == id_extraido )){
            let indice = carrito.indexOf(carrito.find(({id})=>id==id_extraido ));
            carrito[indice].cantidad > 1 && carrito[indice].cantidad--    
    /*        if(carrito[indice].cantidad > 1){
                carrito[indice].cantidad--;
            } */
        }
        renderisado_carrito();
    }

    function sumar_cantidad(e){
        contenedor_carrito_js.innerText ="";
        let id_extraido = Number(extractor_numero(e.target.id));
        if(carrito.find(({id})=> id == id_extraido)){
            let indice = carrito.indexOf(carrito.find(({id})=>id==id_extraido));
            carrito[indice].cantidad++ ;
        }
        renderisado_carrito();
    }

    function envio_info(){
        let ventana_envio = document.createElement("div")
        ventana_envio.className ="ventana_finalizado_comprar"

        Swal.fire({
            title: '<h3 class="titulo_alerta">Quiere confirmar su compra</h3>',
            showCancelButton: true,
            confirmButtonColor: '#00aa14',            
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si quiero',
            cancelButtonText: 'Seguir Comprando',
            background: '#000000 url("./img/fondo2.jpg")',

            }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '<h3 class="titulo_alerta">Agradecemos su compra!!!</h3>',
                    html: '<h4 class="sub_titulo_alerta">En breve nos contactaremos con usted</h4>',
                    //imageUrl: './img/enviado.png',
                    imageUrl:'./img/logo.png',
                    imageWidth: 400,
                    imageHeight: 400,
                    imageAlt: 'Custom image',
                    confirmButtonColor: '#00aa14',
                    background: '#000000 url("./img/fondo2.jpg")',
                })
                realizar_comprar()
                }
            })
        function realizar_comprar(){
            localStorage.clear();
            contenedor_carrito_js.innerText ="";
            carrito = []
            mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> <p class="cantidad_carrito">`;
                    visualisacion_carrito();
        }
    }
}
