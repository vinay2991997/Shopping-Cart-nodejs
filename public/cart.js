
function fetchProduct() {
    $.get('/cart',
        (data) => {
            console.log(data)
            if (data.success == false) {
                alert(data.error)
            } else {
                $('#cartProductList').empty()
                data.forEach(element => {
                    if(element.total == undefined)
                    $('#cartProductList').append(`<li>Product id : ${element.product_id} | Quantity : ${element.quantity}</li>`)
                });
            }
        })
}

$(() => {
    fetchProduct()
})