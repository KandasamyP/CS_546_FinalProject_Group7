$(document).ready(function() {
    $(".dog-chosen").hide();
    $(".cat-chosen").hide();

    $("#dog").click(function() {
        $(".cat-chosen").hide();
        $(".dog-chosen").show();
    });

    $("#cat").click(function() {
        $(".dog-chosen").hide();
        $(".cat-chosen").show();
    });

    $("input.breeds").on("change", function() {
        if ($("input[name='breeds']:checked").length > 2) {
            this.checked = false;
        }
    });

    // keep the dropdown from closing immediately
    $(".dropdown-menu").click(function(event) {
        event.stopPropagation();
    });
});