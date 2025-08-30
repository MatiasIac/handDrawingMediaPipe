const score = {
    id: 11,
    name: 'score',
    isVisible: true,
    x: 590,
    y: 20,
    scoreCounter: 0,

    init: function() { 
        SCORE = 0;
    },

    update: function(delta) {
        if (!IS_IDLE) {
            this.scoreCounter += delta;

            if (this.scoreCounter > 1) {
                this.scoreCounter = 0;
                SCORE++;
            }
        }
    },

    draw: function(ctx) {
        ctx.font = "11pt gameFont";
        ctx.fillStyle = "#535353";
        
        ctx.fillText(SCORE, this.x - (ctx.measureText(SCORE).width), this.y);
        
        ctx.fillText(`HI - ${HIGH_SCORE}`, 
            300 - (ctx.measureText(`HI - ${HIGH_SCORE}`).width / 2), 
            this.y
        );
    }
};