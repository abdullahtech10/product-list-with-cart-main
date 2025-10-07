let products = []
fetch('data.json')
    .then(res => res.json())
    .then(data => {
        console.log(data)
        products = data
        renderProduct(products)


    })
    .catch(err => console.error('error loading json', err)
    )

const emptyCon = document.querySelector('.empty-cart')
const carbonCon = document.querySelector('.carbon-con')

function renderProduct(item) {
    const productContainer = document.querySelector('.product-con')
    productContainer.innerHTML = ''


    item.forEach((product, index) => {
        product.id = index + 1
        // console.log(product.id)
        const div = document.createElement('div')
        div.classList.add('product')
        div.innerHTML = `
            <div class="image-con">
                <img src="${product.image.desktop}" alt="${product.name}" class='desk'>
                <img src="${product.image.mobile}" alt="${product.name}" class='mob'>

                <div class='qty-control'>
                    <button class = 'decrease'>
                        <img src="/assets/images/icon-decrement-quantity.svg" alt="" class='minus'>
                    </button>
                    <p class='qty-num'>1</p>
                    <button class='increase'>
                        <img src="/assets/images/icon-increment-quantity.svg" alt="">
                    </button>

                </div>
             
            </div>
            <div class='desc'>
                    <p class='category'>${product.category}</>
                    <h3>${product.name}</h3>
                    <p class='price'>$${product.price.toFixed(2)}</>
                </div>
        `
        const btn = document.createElement('button')
        btn.className = 'add'
        btn.classList.add('addBtn')
        btn.innerHTML = `
                        <img src="/assets/images/icon-add-to-cart.svg" alt="">
                            <span>Add to Cart</span>
        `

        const qtyControl = div.querySelector('.qty-control')
        const qtyNum = div.querySelector('.qty-num')
        const imageCon = div.querySelector('.image-con')
        // const addToCartCon = document.querySelector('.add-to-cart-con')
        let qty = 0

        btn.addEventListener('click', () => {
            qty = 1
            qtyNum.textContent = qty
            btn.style.display = 'none'
            emptyCon.style.display = 'none'
            qtyControl.style.display = 'flex'
            carbonCon.style.display = 'block'
            imageCon.classList.add('border')
            updateCart(product, qty)
        })

        qtyControl.querySelector('.increase').addEventListener('click', () => {
            qty++
            qtyNum.textContent = qty
            updateCart(product, qty)
        })

        qtyControl.querySelector('.decrease').addEventListener('click', () => {
            qty--

            if (qty <= 0) {
                qty = 0
                btn.style.display = 'block'
                qtyControl.style.display = 'none'
                imageCon.classList.remove('border')
                removeFromCart(product)
            } else {
                qtyNum.textContent = qty
                updateCart(product, qty)

            }
        })



        div.querySelector('.image-con').appendChild(btn)

        productContainer.appendChild(div)
    })
}

let cart = []
//This function updates the global cart array when a product is added, increased, decreased, or removed.

function updateCart(product, qty) {
    const existing = cart.find(item => item.id === product.id)

    if (existing) {

        //remove item if === 0
        if (qty <= 0) {
            cart = cart.filter(item => item.id !== product.id)
        } else {
            existing.quantity = qty
        }
    } else {
        // if not in cart push new
        if (qty > 0) {

            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: qty,
                image: product.image.desktop
            })
        }
    }


    renderCart()
}

function removeFromCart(product) {
    cart = cart.filter(item => item.id !== product.id)
    renderCart()

    const allProducts = document.querySelectorAll('.product')
    allProducts.forEach(prod => {
        const title = prod.querySelector('h3').textContent
        if (title === product.name) {
            const btn = prod.querySelector('.addBtn')
            const qtyControl = prod.querySelector('.qty-control')
            const imageCon = prod.querySelector('.image-con')
            btn.style.display = 'block'
            qtyControl.style.display = 'none'
            imageCon.classList.remove('border')
        }
    })
}

const addToCartCon = document.querySelector('.add-to-cart-con')
function renderCart() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const ordernum = document.querySelector('.cart-num')
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
    addToCartCon.innerHTML = ''

    ordernum.textContent = totalQty

    if (cart.length === 0) {
        addToCartCon.style.display = 'none'
        emptyCon.style.display = 'block'

        carbonCon.style.display = 'none'

    } else {
        addToCartCon.style.display = 'block'
    }

    cart.forEach(item => {
        const MyCart = document.createElement('div')
        MyCart.className = 'cart-item'
        MyCart.innerHTML = `
            <div class='item-con'>
                <div class='item'>
                    <h4>${item.name}</h4>
                    <div class='sub-item'>
                        <p class='quantity'>${item.quantity}x</p>
                        <p class='item-price'>@ $${item.price.toFixed(2)}</p>
                        <p class='total-item-price'>$${(item.price * item.quantity).toFixed(2)}</p>

                    
                    </div>

                </div>  
                <div class='remove-icon'>
                    <img src="/assets/images/icon-remove-item.svg" alt="" class='remove-cart'>
                </div>
            
            </div>
           
            
        `
        MyCart.querySelector('.remove-cart').addEventListener('click', () => {
            removeFromCart(item)
            // console.log('jhdhjd')
        })
        addToCartCon.appendChild(MyCart)
    })

    const totalOrder = document.createElement('div')
    totalOrder.innerHTML = `
          <div class='total-con'>
                <p>Order total</p>
                <h3>$${total.toFixed(2)}</h3>
            </div>
    `


    addToCartCon.appendChild(totalOrder)

}

const confirmBtn = document.querySelector('.confirm')
const orderConfirmedCon  = document.querySelector('.order-confirmed')
const startNewOrderbtn = document.querySelector('.start-new-order')
const overlay = document.querySelector('.overlay')
const orderPlaced = document.querySelector('.order-placed')

confirmBtn.addEventListener('click',  ()=>{
    orderConfirmedCon.style.display  = 'block'
    overlay.classList.add('active')
    const totalOrderPrice  = cart.reduce((sum, item)  => sum + item.price * item.quantity, 0)

    orderPlaced.innerHTML = ''
    cart.forEach(item =>{
        const div = document.createElement('div')
        div.className = 'item-ordered'
        div.innerHTML = `
            <div class='order-info'>
                <img src='${item.image}' alt='${item.name}'>
                
                <div>
                    <h4>${item.name}</h4>
                    <div class='confirm-qty'>
                        <p class='quantity'>${item.quantity}x</p>
                        <p class='item-price'>@ $${item.price.toFixed(2)}</>
                    </div>

                    
                </div>
                    
            </div>
            <div class='confirm-item-price-con'>
                <p class='confirm-item-price para'>$${(item.price * item.quantity).toFixed(2)} </p>
            </div>
           
        `

        orderPlaced.appendChild(div)
    })

    const totalOrderPlaced = document.createElement('div')
    totalOrderPlaced.innerHTML = `
        <div class='total-con'>
                <p>Order total</p>
                <h3>$${totalOrderPrice.toFixed(2)}</h3>
        </div>
    `
    orderPlaced.appendChild(totalOrderPlaced)

    cart = []
    renderCart()

})

startNewOrderbtn.addEventListener('click', ()=>{
    orderConfirmedCon.style.display = 'none'
    overlay.classList.remove('active')
    // Reset all products
    const allProducts = document.querySelectorAll('.product')
    allProducts.forEach(prod => {
        const btn = prod.querySelector('.addBtn')
        const qtyControl = prod.querySelector('.qty-control')
        const imageCon = prod.querySelector('.image-con')

        btn.style.display = 'block'
        qtyControl.style.display = 'none'
        imageCon.classList.remove('border')
    })
    emptyCon.style.display = 'block'
})