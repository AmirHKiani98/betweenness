$("#menu-controller, #close-right-pad").click(function(event) {
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
checkBoxLists = ["actiavate-remove-circle-btn", "actiavate-adding-btn", "actiavate-selecting-btn"];
$("#actiavate-selecting-btn").click(activatorsFunction);
$("#actiavate-adding-btn").click(activatorsFunction);
$("#actiavate-remove-circle-btn").click(activatorsFunction);

function activatorsFunction(event) {
    id = $(this)[0].id;
    for (let index = 0; index < checkBoxLists.length; index++) {
        const element = checkBoxLists[index];
        if ($(this)[0].id !== element) {
            $("#" + element).prop("checked", false)
        }
    }
}