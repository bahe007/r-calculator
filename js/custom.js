/**
 * Client-Logik
 */

/* Konstanten */

/* Handler */
$(document).ready(function() {

    $(".start-incidence").on("input", updateStartIncidence);

    // Reagiere auf "Box hinzufügen"-Button
    $(".add-r-box").click(addRBox);

    // Entferne eine Box
    $(document).on("click", ".remove-r-box", removeRBox);

    // R-Wert in einer Box wurde verändert
    $(document).on("change", ".r-range", sliderMoved)

    // Bereits vorhandene Box aktualisieren
    updateRBox($(document).find(".R-box"));

    // Graphen initial zeichnen
    updateGraph();
});

/**
 * Veranlasst alle nötigen Änderungen für die aktualisierte Start-Inzidenz
 */
function updateStartIncidence() {
    // Eingabe prüfen
    let incidence = parseInt($(".start-incidence").val());
    if ( isNaN(incidence) || incidence < 20 || incidence > 1000 ) {
        $(".start-incidence").addClass("is-invalid");
        $(".start-incidence-label").css("display","block");
        return;
    } else {
        $(".start-incidence").removeClass("is-invalid");
        $(".start-incidence-label").css("display","none");
    }

    // Daten aktualisieren
    let boxes = $(".R-box");
    for( let i=0; i<boxes.length; i++ ) {
        updateRBox($(boxes[i]));
    }

    updateGraph();
}

/**
 * Aktualisiert die jeweilige Box & zeichnet den Graphen neu.
 */
function sliderMoved(event) {
    updateRBox($(event.target).closest(".R-box"));
    updateGraph();
}