$(document).ready(function() {
    for (i=1; i<=8; i++)
        for (j=0; j<1; j++)
            $('#content')
            .append('<div id="stone' + j + '" class="stone' + i + ' solid"></div>');
    var engine = new Engine();
    engine.start();
});
