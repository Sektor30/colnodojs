//Busqueda

let array = document.querySelectorAll('.cover-ctn-search');
let inputSearch = document.getElementById('search-box');
let boxSearch = document.getElementById('box-search');

for (let i=0; i < array.length; i++) {

    array[i].addEventListener('click', function() {
        searchForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        loginForm.classList.remove('active');
        navbar.classList.remove('active');
        inputSearch.value = "";
    })
}

function quitarAcentos(cadena){
	const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
	return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
}

function buscador_interno() {

    filtro = inputSearch.value.toUpperCase();
    li = boxSearch.getElementsByTagName("li");

    for (i=0; i < li.length; i++) {

        a = li[i].getElementsByTagName("a")[0];
        textValue = quitarAcentos(a.textContent) || quitarAcentos(a.innerText);

        if (textValue.toUpperCase().indexOf(filtro) > -1) {

            li[i].style.display = "";
            boxSearch.style.display = "block";

            if(inputSearch.value === "") {
                boxSearch.style.display = "none";
            }
            
        }else {

            li[i].style.display = "none";

        }
    }
}

document.getElementById('search-box').addEventListener("keyup", buscador_interno);

//Search btn
let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {

    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
    inputSearch.value = "";
    inputSearch.focus();
}

//Shopping-cart
let shoppingCart = document.querySelector('.shopping-cart');

document.querySelector('#cart-btn').onclick = () => {

    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
    inputSearch.value = "";
}

//Login
let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
    inputSearch.value = "";
}

//Hamburguer
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    inputSearch.value = "";
}

//window
window.onscroll = () => {
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
    inputSearch.value = "";
}

//Banner

let counter = 1;
setInterval(function() {
    document.getElementById('radio' + counter).checked = true;
    counter++;
    if(counter > 4) {
        counter = 1;
    }
}, 5000);

//Reseñas

let swiper = new Swiper(".review-slider", {
    loop: true,
    spaceBetween: 20,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1020: {
            slidesPerView: 3,
        },
    },
})


//Menu
let carrito = {};
let menu = document.getElementById('menu-container');
menu.addEventListener('click', addCarrito);

function comidas() {
    
    fetch('api.json')
    .then(response => response.json())
    .then(data => {
        let html = "";
        data.forEach(comida => {
            html += `
            <div class="box" id="box">
                <img src="${comida.thumbnailUrl}" alt="">
                <h3>${comida.title}</h3>
                <span>Precio:</span>
                <p class="precio">${comida.precio}</p>
                <a class="btn btn-orden" data-id="${comida.id}" href="#">Ordenar</a>
            </div>
            `;
        });
    

        menu.innerHTML = html;
    });

}

comidas();

let pedidoContainer = document.getElementById('pedido-container');
let total = document.getElementById('total');
let cantidad = document.getElementById('cantidad');
let emailInfo = document.getElementById('box-form');

function addCarrito(e) {
    e.preventDefault();

    if(e.target.classList.contains('btn-orden')) {
        setCarrito(e.target.parentElement)
    }
}

function paintCarrito() {
    let pedido_html = "";
    let email_html = "";
    pedidoContainer.innerHTML = "";
    Object.values(carrito).forEach(producto => {
        pedido_html += `
        <div class="box-pedido box">
            <i class="fas fa-trash"></i>
            <img src="${producto.imagen}" alt="">
            <div class="content">
                <h3>${producto.title}</h3>
                <span class="etiqueta">Precio:</span>
                <span class="price">${producto.precio * producto.cantidad}/-</span>
                <span class="quantity">ctd : ${producto.cantidad}</span>
            </div>
        </div>
        `;
        email_html += `
        <input type="text" name="comida" value="${producto.title}">
        <input type="text" name="cantidad" value="${producto.cantidad}">
        <input type="text" name="precio" value="${producto.precio * producto.cantidad}">
        `;
    })
    pedidoContainer.innerHTML = pedido_html;
    emailInfo.innerHTML = email_html;
}

function setCarrito(objeto) {
    const producto = {
        id: objeto.querySelector('.btn-orden').dataset.id,
        title: objeto.querySelector('h3').textContent,
        imagen: objeto.querySelector('img').getAttribute('src'),
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = { ...producto };

    paintCarrito();
    total_cuenta();
}

function total_cuenta() {

    let nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0);
    let nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0);

    total.innerHTML = `Total: $${nPrecio}/-`;
    cantidad.innerHTML = `Ctd total: ${nCantidad}`;
}

const vaciar = document.getElementById('Vaciar-carrito');
vaciar.addEventListener('click', () => {
    carrito = {};
    paintCarrito();
    total.innerHTML = `Total: $0/-`;
    cantidad.innerHTML = `Ctd total: 0`;
})

