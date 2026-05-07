export function getCart(){
    let cartString = localStorage.getItem('cart')

    if(cartString == null){
        cartString = '{}'
        localStorage.setItem('cart', cartString)
    }

    const cart = JSON.parse(cartString)
    return cart
}

export function addToCart(product, quantity){
    const cart = getCart()
    const existingProductIndex = cart.findIndex((item) => {
        return item.productId === product.id
    })
    if(existingProductIndex == -1){
        cart.push(
            {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                altNames : product.altNames,
                images : product.images
            }
        )
    } else {
        const newQuantity =  cart[existingProductIndex].quantity += quantity
        if(newQuantity <= 0){
            const newCart = cart.filter((item) => {
                return item.productId !== product.id
            })
            localStorage.setItem('cart', JSON.stringify(newCart))
            return
        } else {
            cart[existingProductIndex].quantity = newQuantity
            localStorage.setItem('cart', JSON.stringify(cart))
            return
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart))
}