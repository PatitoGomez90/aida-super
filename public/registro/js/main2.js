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
            Login()
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

async function Login() {
    let body = {
        email: $("#email").val(),
        dni: $("#dni").val()
    }

    $(".loading-screen").fadeIn(900);
    const res = await $.post("/iniciar-sesion", body);
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