
//*************************************************************************************************************************************************
/* let helados=[]
fetch('./js/data.json')
    .then((resp)=>resp.json())
    .then((data)=>{
        helados = data
        mostrar_producto(helados)
    }) 
 */

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
    //let filtro_check_precios=[];
    //let busqueda_con_check  ="";
    let busqueda = "";

    //let cuerpo = document.getElementById("main_html");

    let boton_buscar_js = document.getElementById("boton_buscar");
    let contenedor_principal = document.getElementById("contenedor_principal");

    let input_buscar_html = document.getElementById("input_buscar");
    input_buscar_html.onchange = realizar_busqueda;

    let contenedor_carrito_js =document.getElementById("contenedor_carrito");
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

    let icono_mostrar = `<img src="./img/cerrar.png" alt="">`
    let icono_cerrar = `<img class="carrito"src="./img/carrito_left.png" alt="">`
    /* const DateTime = luxon.DateTime; //aplicacion de luxon
    const now = DateTime.now()
    console.log(DateTime.fromISO("2017-05-15T20:15:00"))
    console.log(DateTime.now().toString())

    let  dt = DateTime.now()
    let hora_compra = dt.toLocaleString(DateTime.DATETIME_MED)
    console.log(dt.hour + ":" + dt.minute)
    console.log(hora_compra)
    console.log(hora_compra.plus({ hours: 3, minutes: 2 })) */
    //Funciones*******************************************************************************************************************************************************

    function mostrar_producto(productos){//funtion para crear caja contenedores de productos
        contenedor_principal.innerHTML = "";
        productos.forEach(({id,categoria,img,sabor,descripcion,precio})=>{
            let contenedor_producto = document.createElement("article");
            contenedor_producto.className = "articulo";
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
                            <h4>${precio}$
                            </h4>
                            <button class="boton_agregar" id=elimnar${id}> agregar</button>
                        </div>
                    </div>
                `
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

    mostrar_producto(helados)
    //mostrar_producto(helados);//renderisa la pagina al abrir o refrescar la pagina
    //        <img class="carrito"src="./img/cerrar.png" alt="">
    //        <img class="carrito"src="./img/carrito_left.png" alt=""> 

    function visualisacion_carrito(){//muestra o oculta lo contenido en carrito
        contenedor_principal.classList.toggle("ocultar");
        contenedor_carrito_js.classList.toggle("ocultar");
        if(contenedor_carrito_js.className.includes("ocultar")==false){
            mostrar_carrito.innerHTML =`<img class="carrito"src="./img/cerrar.png" alt="">`;
        }else{
            //carrito.length != 0 ? mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> ${carrito.length}`:  mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> `
             if(carrito.length != 0){
                    mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> <p class="cantidad_carrito">${carrito.length}</p>`;
                }else{
                    mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> `;
                }  
        }
    };

    


    function limpiesa_input(){
        busqueda = "";
        input_buscar_html.value = "";
        filtro == "" ? mostrar_producto(helados): filtrado_check();
    /*      if(filtro_check == ""){
            mostrar_producto(helados);
            }else{
                filtrado_check();
            } */
    }

    function realizar_busqueda(){
        filtrados = "";
        busqueda = input_buscar_html.value.toLowerCase()
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

    function renderisado_carrito(){
        sub_total = []
        carrito.forEach(({cantidad,precio})=>sub_total.push(cantidad*precio));
        total = sub_total.reduce((a,el)=> a + el,0);
        carrito.forEach(({id,sabor,cantidad,precio})=> contenedor_carrito_js.innerHTML +=`
                <div>
                    <p> ${id}) sabor:${sabor} </p>
                    <button  class ="class_boton_restar" id=restar${id}>- </button>   
                    <span> ${cantidad} </span>
                    <button  class ="class_boton_agregar" id=sumar${id}> + </button>   
                    <button class="botones_quitar"  id=quitar${id}>quitar</button>
                    <span> ${cantidad * precio} </span>
                </div>
            `
        );
        if(carrito!=""){
            contenedor_carrito_js.innerHTML +=`
                    <div>
                        <span> Total:${total} </span>
                        <button  id=finalizar_compra>Finalizar comprar</button>
                    </div>
                `;
            let botones_sumar = document.querySelectorAll(`.class_boton_agregar`);   
            let botones_restar = document.querySelectorAll(`.class_boton_restar`);    
            let botones_eliminar_articulos = document.querySelectorAll(`.botones_quitar`);

            botones_eliminar_articulos.forEach((el)=>el.onclick =elminar_articulo);
            botones_restar.forEach((el)=>el.onclick = restar_cantidad);
            botones_sumar.forEach((el)=>el.onclick = sumar_cantidad);
            localStorage.setItem("producto_usuario",JSON.stringify(carrito));

            let finalizado_compra = document.getElementById("finalizar_compra");
            finalizado_compra.onclick = envio_info
            
            if(contenedor_carrito_js.className.includes("ocultar")){
                mostrar_carrito.innerHTML =`<img class="carrito"src="./img/carrito_left.png" alt=""> <p class="cantidad_carrito">${carrito.length}</p>`;
            }else{
                mostrar_carrito.innerHTML =`<img class="carrito"src="./img/cerrar.png" alt="">`
            }   
        }else{
            contenedor_carrito_js.innerHTML =`
                        <div>
                            <span>No tiene articulos en su carrito </span>
                        </div>
                    `;
        }   
    };
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
        contenedor_carrito_js.innerText ="";
        let id_extraido = Number(extractor_numero(e.target.id));
        if(carrito.find(({id})=> id == id_extraido)){
            let indice = carrito.indexOf(carrito.find(({id})=>id==id_extraido));
            carrito[indice].cantidad++ ;
        }else{ 
            carrito.push(helados.find(({id})=>id==id_extraido));
            carrito[carrito.length-1].cantidad = 1;
        }
        renderisado_carrito();



/*         if(contenedor_carrito_js.className.includes("ocultar")){
            mostrar_carrito.innerHTML=`carrito${carrito.length}`;
        }else{
            mostrar_carrito.innerText ="ocultar"
        } */
        
    
        Toastify({
            text: "agrego al carrito",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){} // Callback after click
        }).showToast();
    }

    function elminar_articulo(e){
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
    /*     let text_swal =""
        carrito.forEach(({id,sabor,cantidad,precio})=>{ text_swal +=`\n ${id} sabor:${sabor}${cantidad}  ${cantidad * precio} \n `}) 
        text_swal +=  `\nTotal:${total}  `  */
        let html_insert="" 
        carrito.forEach(({id,sabor,cantidad,precio})=> html_insert +=`
                            <p> ${id}) ${sabor} ${cantidad} SubTtotal ${cantidad * precio} </p>
                    `) + `<div></div><p> Totol: ${total}</p>>`
        Swal.fire({
            title: 'Quiere confirmar su compra?',
            text: "You won't be able to revert this!",
            html: html_insert,
            icon: 'pregunta',
            showconfirmbutton:true,
            showCancelButton: true,
            confirmButtonColor: '#00aa14',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si quiero',
            cancelmButtonText: 'Volver al carrito',
            background: '#000000',

            }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    //title: 'Sweet!',
                    text: 'Agradesemos su compra, su pedido esta en camino',
                    imageUrl: './img/enviado.png',
                    imageWidth: 400,
                    imageHeight: 400,
                    imageAlt: 'Custom image',
                    confirmButtonColor: '#00aa14',
                    background: '#000000',
                })
                realizar_comprar()
            /*     Swal.fire(
                    'agradesemos su compra',
                    'su producto llegara',
                    'success',
                    realizar_comprar()
                ) */
                }
            })

    /* 
        carrito.forEach(({id,sabor,cantidad,precio})=> ventana_envio.innerHTML +=`
                <div >
                    <p> ${id} sabor:${sabor} </p>
                    <span> ${cantidad} </span>
                    <span> ${cantidad * precio} </span>
                </div>
            `
        );
        ventana_envio.innerHTML =`
            <div id=envio_productos>
                ${ventana_envio.innerHTML}
                <div>
                    <span> Total:${total} </span>
                    <button  id=boton_volver>volver a la tienda</button>
                    <button  id=boton_confirmar>confirmar compra</button>
                </div>
            </div>
        `; 
        cuerpo.appendChild(ventana_envio) */

    /*     let boton_confirmar = document.getElementById("boton_confirmar") 
        boton_confirmar.onclick = realizar_comprar

        let boton_volver = document.getElementById("boton_volver")
        boton_volver.onclick = volver_tienda
        */
        function realizar_comprar(){
    /*         ventana_envio.innerHTML=`
            <div id=envio_productos>
                <p>
                        Agradesemos su compra
                    </p>
                    <button  id=boton_aceptar>aceptar</button>
                </div>   
            `  */
            
            localStorage.clear();
            contenedor_carrito_js.innerText ="";
            carrito = []
            visualisacion_carrito()
            contenedor_carrito_js.innerHTML =`
                    <div >
                        <span>No tiene articulos en su carrito </span>
                    </div>
                `
        /*    let boton_aceptar = document.getElementById("boton_aceptar");
            boton_aceptar.onclick = cerra_ventana; */
        }

    /*     function volver_tienda(){
            ventana_envio.innerHTML = ""
            ventana_envio.classList.remove("ventana_finalizado_comprar")
        }
        
        function cerra_ventana(){
            ventana_envio.innerHTML = ""
            ventana_envio.classList.remove("ventana_finalizado_comprar")
            contenedor_carrito_js.innerHTML =`
            <div >
                <span>No tiene articulos en su carrito </span>
            </div>
            `;
        } */
    }




}
