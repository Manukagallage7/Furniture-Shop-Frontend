function normalizeCart(rawCart) {
    return Array.isArray(rawCart) ? rawCart : []
}

export function getCart() {
    try {
        const rawCart = localStorage.getItem('cart')
        if (!rawCart) {
            return []
        }

        return normalizeCart(JSON.parse(rawCart))
    } catch {
        return []
    }
}

export function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(normalizeCart(cart)))
}

export function addToCart(product, quantity = 1) {
    const cart = getCart()
    const productId = product?.productId ?? product?.id ?? product?._id
    const existingProductIndex = cart.findIndex((item) => {
        return item.productId === productId || item.id === productId
    })

    if (existingProductIndex === -1) {
        cart.push({
            productId,
            id: productId,
            name: product?.name,
            price: Number(product?.actualPrice ?? product?.labelledPrice ?? product?.price ?? 0),
            quantity,
            altNames: product?.altNames,
            images: product?.images,
        })
    } else {
        const nextQuantity = (cart[existingProductIndex].quantity || 0) + quantity

        if (nextQuantity <= 0) {
            const newCart = cart.filter((item) => {
                return item.productId !== productId && item.id !== productId
            })
            saveCart(newCart)
            return
        }

        cart[existingProductIndex].quantity = nextQuantity
    }

    saveCart(cart)
}

export function removeFromCart(productId) {
    const cart = getCart()
    const newCart = cart.filter((item) => {
        return item.productId !== productId && item.id !== productId
    })
    saveCart(newCart)
}

export function clearCart() {
    saveCart([])
}