jsGFwk.Text = (function() {
    var text = function () { };

    text.prototype.wrapText = function(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        context.fillText(line, x, y);
    };

    var textWriter = new text();

    Object.prototype.fillWrapText = function(text, x, y, maxWidth, lineHeight) {
        textWriter.wrapText(this, text, x, y, maxWidth, lineHeight);
    };

    return {};

}());