/* Konstanten */
const RBoxString = '<div class="R-box alert-light">' +
    '<h4>R = 0.7</h4>' +
    '<button type="button" class="close remove-r-box">&times;</button>' +

    '<div class="slider">' +
        '<input type="range" class="custom-range r-range" min="40" max="95" value="70">' +
        '<div class="caption-wrapper">' +
            '<span class="left-caption caption">0.4</span>' +
            '<span class="right-caption caption">0.95</span>' +
        '</div>' +

        '<div class="results">' +
            '<p>Geschätzte Halbierungszeit: <span class="halving-interval badge badge-pill badge-small badge-danger"></span></p>' +
            '<p>Geschätzte Dauer bis zur Inzidenz 50: <span class="50-interval badge badge-pill badge-small badge-danger"></span></p>' +
            '<p>Geschätzte Dauer bis zur Inzidenz 25: <span class="25-interval badge badge-pill badge-small badge-danger"></span></p>' +
            '<p>Geschätzte Dauer bis zur Inzidenz 7: <span class="7-interval badge badge-pill badge-small badge-danger"></span></p>' +
        '</div>' +
    '</div>' +
'</div>';

/**
 * Fügt eine neue Box für einen weiteren R-Wert hinzu.
 */
function addRBox() {
    if ( $(".R-box").length >= 4 ) {
        return;
    } else if ( $(".R-box").length == 3 ) {
        $(".add-r-box").css("display", "none");
    }
    $(".R-boxes").append($(RBoxString));

    const RBox = $(".R-box").last();

    updateRBox(RBox);
    updateGraph();
}

/**
 * Entfernt die Box eines R-Wertes. Dazu wird mit jQuery die nächste
 * Box zu `event.target` gesucht.
 */
function removeRBox(event) {
    const box = $(event.target).closest(".R-box");
    $(box).remove();
    
    $(".add-r-box").css("display", "");
    updateGraph();
}

/**
 * Aktualisiert die Werte innerhalb einer R-Box. Dazu wird am Slider der
 * aktuelle Wert ausgeliefert.
 */
function updateRBox(box) {
    const R = box.find(".r-range").val()/100;
    const ci = confidenceInterval(R);
    const Rlower = ci[0];
    const Rupper = ci[1];

    const title = "R = "+R;
    box.find("h4").text(title)

    const halvingInterval = calculateReductionInterval(2.0, 1.0, Rlower, Rupper);
    box.find(".halving-interval").text(intervalToString(halvingInterval));

    const startIncidence = getStartIncidence();
    
    const incidence50 = calculateReductionInterval(startIncidence, 50.0, Rlower, Rupper);
    box.find(".50-interval").text(intervalToString(incidence50));

    const incidence25 = calculateReductionInterval(startIncidence, 25.0, Rlower, Rupper);
    box.find(".25-interval").text(intervalToString(incidence25));

    const incidence7 = calculateReductionInterval(startIncidence, 7.0, Rlower, Rupper);
    box.find(".7-interval").text(intervalToString(incidence7));
}

/**
 * Aktualisiert den Graphen. 
 */
function updateGraph() {
    const N = 60;
    const startIncidence = getStartIncidence();

    const borderColors = ["rgba(255,100,100,0.6)", "rgba(200,100,255,0.6)", "rgba(150,150,255,0.6)", "rgba(50,50,255,0.6)"];
    const backgroundColors = ["rgba(255,100,100,0.6)", "rgba(200,100,255,0.6)", "rgba(150,150,255,0.6)", "rgba(50,50,255,0.6)"];

    const datasets = []
    
    // Ziele
    datasets.push({
        borderColor: "#000000",
        fill: false,
        data: Array(N).fill(7),
        label: ""
    });
    datasets.push({
        borderColor: "#000000",
        fill: false,
        data: Array(N).fill(25),
        label: ""
    });
    datasets.push({
        borderColor: "#000000",
        fill: false,
        data: Array(N).fill(50),
        label: ""
    });

    const boxes = $(".R-box");
    for( var i=0; i<boxes.length; i++ ) {
        const R = $(boxes[i]).find(".r-range").val()/100;

        const timeUntilR7 = calculateReductionTime(startIncidence, 7, R+0.025);
        const maxT = Math.min(N, timeUntilR7);

        const lowerBound = {
            backgroundColor: backgroundColors[i],
            borderColor: backgroundColors[i],
            data: calculateDailyIncidenceValues(startIncidence, R-0.025, maxT),
            label: "R = "+R,
            fill: "+1",
            borderWidth: 0.0
        };
        const upperBound = {
            fill: false,
            borderColor: backgroundColors[i],
            data: calculateDailyIncidenceValues(startIncidence, R+0.025, maxT),
            label: "R = "+R,
            borderWidth: 0.0
        }

        datasets.push(lowerBound);
        datasets.push(upperBound)
    }

    const data = {
        labels: generateGraphLabels(N),
        datasets: datasets
    };

    const options = {
        elements: {
            point: {
                radius: 0
            }
        },
        legend: {
            labels: {
                filter: function(legendItem, chartData) {
                 if (legendItem.datasetIndex % 2 == 0 || legendItem.datasetIndex <= 2) {
                   return false;
                 }
                return true;
                }
             }
         },
         scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Zeit [Tage]'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Inzidenz'
                }
            }]
        },
        animation: {
            duration: 0
        }
    };

    const myLineChart = new Chart("incidence-chart", {
        type: 'line',
        data: data,
        options: options
    });
}

/**
 * Generiert Labels für den Graphen.
 * @param {int} N Zahl der Tage
 */
function generateGraphLabels(N) {
    let labels = ["", "1"];
    for ( let i=2; i<N; i++ ) {
        if ( i%5 == 0 ) {
            labels.push(""+i);
        } else {
            labels.push("");
        }
    }
    return labels;
}