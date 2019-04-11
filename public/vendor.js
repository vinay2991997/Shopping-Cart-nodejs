
function foo(id){
    console.log((id))
}

function deleteVendor(id) {
    $.ajax({
        url: `/vendor/${id}`,
        type: 'DELETE',
        success: (result) => {
            console.log(result)
            if (result.success == false) {
                $('#error').text(result.error)
            } else {
                refreshList()
            }
        }
    })
}

function refreshList() {
    $.get('/vendor',
    (data) => {
        $('#vendorList').empty()
        data.forEach(element => {
            $('#vendorList').append(`<li>${element.name} <button type="submit" id="delVendor" onclick="deleteVendor(${element.id})">X</button> </li>`)
        });
    })
}

$(() => {

    refreshList()


    $('#addVendor').click(() => {
        $.post('/vendor',
        {
            name : $('#vendornametxt').val()
        },
        (data) => {
            if (data.success) {
                refreshList()
            }
            else {
                $('#error').text(data.error)
            }
        })
    })

    
})