$(document).ready(function() {
    var i, j;
    for (i=1; i<=8; i++)
        for (j=0; j<1; j++)
            $('#content')
            .append('<div id="stone' + j + '" class="stone' + i + ' solid"></div>');
    $('#solidCnt').text((i-1)*j);
    var config = new Configurator();
    var engine = new Engine(config);
    engine.start();
});
