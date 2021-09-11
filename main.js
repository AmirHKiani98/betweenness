$("#menu-controller").click(function(event) {
    $("#right-menu").css("right")
    switch ($("#right-menu").css("right")) {
        case "0px":
            $("#right-menu").css("right", "-100%");
            break;
        default:
            $("#right-menu").css("right", "0px");
            break;
    }
})