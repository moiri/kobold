Engine.prototype.debug = function () {
    var me = this,
        cssClass = '',
        elem = null,
        id = 'engineDebug';
    $('body').append('<div id="' + id
            + '" class="engineDebug"></div>');
    $('<div class="engine-debug-title">Engine Config</div>')
        .appendTo('#' + id)
        .click(function (e) {
            e.stopPropagation();
            $('#engine-debug-content').toggle();
        });
    $('#' + id).append('<div id="engine-debug-content"'
            + ' class="engine-debug-content"></div>');
    for (elem in me.enable) {
        cssClass = '';
        if (!me.getEnableStatusAttr(elem)) cssClass = ' disable';
        $('<div class="configElem clickable' + cssClass + '">' + elem
                + '</div>')
            .appendTo('#engine-debug-content')
            .click(function (e) {
                e.stopPropagation();
                me.toggleEnableAttr($(this).text());
                $(this).toggleClass('disable');
            });
    }
};

Movable.prototype.debug = function debug() {
    var me = this,
        cssClass = '',
        elem = null,
        id = me.id + 'Debug';
    $('#' + me.id).append('<div id="' + id
            + '" class="movableDebug"></div>');
    $('<div class="movable-debug-title">Config</div>')
        .appendTo('#' + id)
        .click(function (e) {
            e.stopPropagation();
            $('#' + me.id + '-debug-content').toggle();
        });
    $('#' + id).append('<div id="' + me.id
            + '-debug-content" class="movable-debug-content"></div>');
    for (elem in me.enable) {
        cssClass = '';
        if (!me.getEnableStatusAttr(elem)) cssClass = ' disable';
        $('<div class="configElem clickable' + cssClass + '">' + elem
                + '</div>')
            .appendTo('#' + me.id + '-debug-content')
            .click(function (e) {
                e.stopPropagation();
                me.toggleEnableAttr($(this).text());
                $(this).toggleClass('disable');
            });
    }
};
