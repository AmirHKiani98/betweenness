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

$("#upload-graph-button").click((event) => {
    $("#upload-graph-input").trigger("click");
})
$("#download-graph-button").click((event) => {
    $("#download-graph-input").trigger("click");
})

$("#download-graph-input").change((event) => {
    var form = new FormData();
    var imageData = document.getElementById('download-graph-input').files[0]; //get the file 
    if (imageData) { //Check the file is emty or not
        form.append('download-graph-input', imageData); //append files
    }
    $.ajax({
        type: 'POST',
        processData: false,
        contentType: false,
        data: form,
        url: "/src/handleGraphFiles.php", //My reference URL
        dataType: 'json',
        success: function(jsonData) {
            console.log(jsonData);
        },
        error: function(data) {
            console.log(data);
        }
    });
})