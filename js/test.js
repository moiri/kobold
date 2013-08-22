$(document).ready(function() {
    var i, j;
    for (i=1; i<=8; i++)
        for (j=0; j<1; j++)
            $('#content')
            .append('<div id="stone' + j + '" class="stone' + i + ' solid"></div>');
    $('#content').append('<div id="elevator1" class="elevator1 solid moving"></div>');
    $('#content').append('<div id="pickUp1" class="pickUp1 pickUp"></div>');
    $('#content').append('<div id="pickUp2" class="pickUp2 pickUp"></div>');
    $('#solidCnt').text((i-1)*j);
    var koboldConf = new Configurator();
    var engine = new Engine(koboldConf);
    engine.start();
});
