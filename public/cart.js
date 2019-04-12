
function fetchProduct() {
    $.get('/cart',
        (data) => {
            console.log(data)
            if (data.success == false) {
                alert(data.error)
            } else {
                let total = 0
                $('#cartProductList').empty()
                data.forEach(element => {
                    if(element.total == undefined) {
                        $('#cartProductList').append(`<li>
                        Product name : ${element.product.name} | 
                        Price : ${element.product.price} | 
                        Quantity : ${element.quantity}</li>`)
                    } else {
                        total = element.total
                    }

                });
                $('#total').text(total)
            }
        })
}

$(() => {
    fetchProduct()
})