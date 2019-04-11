$(() => {

    function init() {
        $.get(
            '/login',
            (data) => {
                if (data.success) {
                    $('#usrnametxt').hide()
                    $('#login').hide()
                    $('#logout').show()
                    $('#msg').show()
                    $('#msg').text(data.message)
                }
                else {
                    $('#usrnametxt').show()
                    $('#login').show()
                    $('#logout').hide()
                    $('#msg').show()
                    $('#msg').text(data.message)
                }
            }
        )
    }
    init()

    $('#login').click(() => {
        $.post(
            '/login',
            {
                name : $('#usrnametxt').val()
            },
            ()=>{
                init()
            })
    })

    $('#logout').click(() => {
        $.get('/logout',
        () => {
            init()
        })
    })
})