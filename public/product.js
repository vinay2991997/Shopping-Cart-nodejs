
function vendorList() {
    $.get('/vendor',
        (data) => {
            $('#vendorOption').empty()
            data.forEach(element => {
                $('#vendorOption').append(`<option value="${element.id}">${element.name}</option>`)
            });
        })
}

function productList() {
    $.get('/product',
        (data) => {
            $('#productList').empty()
            
            $('#productList').append(`<li>Name | Price | Quantity | Vendor</li>`)
            data.forEach(element => {
                $('#productList').append(`<li value="${element.id}">${element.name} | ${element.price} | ${element.quantity} | ${element.vendor.name}
                <button type="submit" id="addToCart" onclick="addToCart(${element.id})">Add To Cart</button>
                <button type="submit" id="deleteProduct" onclick="deleteProduct(${element.id})">Delete Product</button>
                </li>`)
            });
        })
}

function addProduct() {
    $.post('/product',
            {
                name: $('#productName').val(),
                price : $('#price').val(),
                vendorId : $('#vendorOption').val(),
                quantity : $('#quantity').val()
            },
            (data) => {
                if (data.success) {
                    alert('product Added Successfully')
                }
                else {
                    alert(data.error)
                }
                productList()
            })
}

function addToCart(id){
    $.post('/cart',
        {
            productId : id
        },
        (data) => {
            if(data.success) {
                alert(data.message)
            }
            else{
                alert(data.error)
            }
        })
}

function deleteProduct(id){
    $.ajax({
        url: `/product/${id}`,
        type: 'DELETE',
        success: (result) => {
            if (result.success == false) {
                alert(result.error)
            } else {
                productList()
            }
        }
    })
}

$(() => {
    vendorList()
    productList()
    $('#addProduct').click(addProduct)
})