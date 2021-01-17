/* Konstanten */
const d = 4.0;

/**
 * Berechnet, wie lange - in Tagen - es dauert, für einen gegebenen R-Wert 
 * eine Ziel-Inzidenz zu erreichen.
 * 
 * @param {float} start Start-Inzidenz
 * @param {float} target Ziel-Inzidenz
 * @param {float} R Reproduktionszahl
 */
function calculateReductionTime(start, target, R) {
    return Math.round(
        Math.log(target/start)*d/(R-1)
    );
}

/**
 * Berechnet, wie lange - in Tagen - es dauert, für einen gegebenen R-Wert 
 * eine Ziel-Inzidenz zu erreichen. Es wird ein Intervall zurückgegeben.
 * 
 * @param {float} start Start-Inzidenz
 * @param {float} target Ziel-Inzidenz
 * @param {float} Rlower niedrigere Reproduktionszahl
 * @param {float} Rupper höhere Reproduktionszahl
 */
function calculateReductionInterval(start, target, Rlower, Rupper) {
    return [calculateReductionTime(start, target, Rlower), calculateReductionTime(start, target, Rupper)];
}

/**
 * Berechnet für `N` Tage die jeweilige Inzidenz, abhängig von einer Startinzidenz und einer Reproduktionszahl
 * @param {int} start Start-Inzidenz
 * @param {float} R Reproduktionszahl
 * @param {int} N #Tage, die gezeichnet werden soll
 */
function calculateDailyIncidenceValues(start, R, N) {
    let data = [];
    
    for(let i=0; i<N; i++){
        data.push( start* Math.exp( (R-1)/d * i ) )
    }

    return data;
}

/**
 * Gibt die obere und untere Grenze für das Reproduktionszahl-Unsicherheits-
 * Intervall zurück. 
 * 
 * @param {float} R Reproduktionszahl
 */
function confidenceInterval(R) {
    return [R-0.025, R+0.025]
}

/**
 * Gibt basierend auf einem Interval einen menschenlesbaren String in Tagen zurück.
 */
function intervalToString(interval) {
    const lower = interval[0];
    const higher = interval[1];

    if ( lower < 5 && lower > 0) {
        return "Wenige Tage";
    }

    if ( lower > 0 && higher > 0 ) {
        return lower+" - "+higher+" Tage";
    } else if ( lower <= 0 && higher > 0 ) {
        return 0+" - "+higher+" Tage";
    } else {
        return "Bereits erreicht";
    }
    
}

/**
 * Gibt die Startinzidenz aus dem Eingabefeld zurück.
 */
function getStartIncidence() {
    return $(".start-incidence").val();
}