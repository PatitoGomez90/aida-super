$(function () {
    $("#wizard").steps({
        headerTag: "h2",
        bodyTag: "section",
        enableAllSteps: true,
        transitionEffectSpeed: 500,
        labels: {
            finish: "Enviar",
            next: "Siguiente",
            previous: "Volver"
        },
        onFinishing: function () {
            Enviar()
        }
    });
    $('.wizard > .steps li a').click(function () {
        $(this).parent().addClass('checked');
        $(this).parent().prevAll().addClass('checked');
        $(this).parent().nextAll().removeClass('checked');
    });
    // Custome Jquery Step Button
    $('.forward').click(function () {
        $("#wizard").steps('next');
    })
    $('.backward').click(function () {
        $("#wizard").steps('previous');
    })
})

async function Enviar() {
    let body = {
        // paso 1
        nombre: $("#nombre").val(),
        apellido: $("#apellido").val(),
        email: $("#email").val(),
        dni: $("#dni").val(),
        // paso 2
        ciudad: $("#ciudad").val(),
        calle: $("#calle").val(),
        numero: $("#numero").val(),
        piso: $("#piso").val(),
        depto: $("#depto").val(),
        codigopostal: $("#codigopostal").val(),
        // paso 3
        celular: $("#celular").val(),
        telefono: $("#telefono").val()
    }

    $(".loading-screen").fadeIn(900);
    const res = await $.post("/registrate", body);
    $(".loading-screen").fadeOut(900);
    Swal.fire({
        type: res.type,
        title: res.title,
        text: res.text
    }).then(() => {
        if (res.type == "success") {
            window.location = "/";
        }
    });
}