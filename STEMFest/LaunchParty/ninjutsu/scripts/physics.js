var physics = (function () {

    var phy = function() {
        this.falling = false, 
        this.jumping = false,
        this.x = 32,
        this.y = 32,
        this.dx = 0,
        this.dy = 0,
        //this.gravity = METER * GRAVITY;
        this.maxdx = METER * MAXDX;
        this.maxdy = METER * MAXDY;
        this.impulse = METER * IMPULSE;
        this.accel = (METER * MAXDX) / ACCEL;
        this.friction = (METER * MAXDX) / FRICTION;
        this.left = false;
        this.right = false;

        this.atMaxRight = false;
        this.atMaxLeft = false;
    };

    phy.prototype.update = function(dt) {
        var wasleft = this.dx < 0,
            wasright = this.dx > 0,
            falling = this.falling,
            friction = this.friction * (falling ? 0.5 : 1),
            accel = this.accel * (falling ? 0.5 : 1);
  
        this.ddx = 0;
        this.ddy = METER * GRAVITY; //this.gravity;
    
        if (this.left) {
            this.ddx = this.ddx - accel;
        } else if (wasleft) {
            this.ddx = this.ddx + friction;
        }
    
        if (this.right) {
            this.ddx = this.ddx + accel;
        } else if (wasright) {
            this.ddx = this.ddx - friction;
        }
    
        if (this.jump && !this.jumping && !falling) {
            this.ddy = this.ddy - this.impulse;
            this.jumping = true;
        }
    
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);
        this.dx = bound(this.dx + (dt * this.ddx), -this.maxdx, this.maxdx);
        this.dy = bound(this.dy + (dt * this.ddy), -this.maxdy, this.maxdy);
    
        if ((wasleft  && (this.dx > 0)) || (wasright && (this.dx < 0))) {
            this.dx = 0;
        }

        var tx        = p2t(this.x),
            ty        = p2t(this.y),
            nx        = this.x%TILE,
            ny        = this.y%TILE,
            cell      = tcell(tx,     ty),
            cellright = tcell(tx + 1, ty),
            celldown  = tcell(tx,     ty + 1),
            celldiag  = tcell(tx + 1, ty + 1);
    
        if (this.dy > 0) {
            if ((celldown && !cell) || (celldiag && !cellright && nx)) {
                this.y = t2p(ty);
                this.dy = 0;
                this.falling = false;
                this.jumping = false;
                ny = 0;
            }
        } else if (this.dy < 0) {
            if ((cell && !celldown) || (cellright && !celldiag && nx)) {
                this.y = t2p(ty + 1);
                this.dy = 0;
                cell = celldown;
                cellright = celldiag;
                ny = 0;
            }
        }
    
        if (this.dx > 0) {
            if ((cellright && !cell) || (celldiag  && !celldown && ny)) {
                this.x = t2p(tx);
                this.dx = 0;
            }
        } else if (this.dx < 0) {
            if ((cell && !cellright) || (celldown && !celldiag && ny)) {
                this.x = t2p(tx + 1);
                this.dx = 0;
            }
        }

        if (this.left && (cell || !celldown)) {
            this.atMaxLeft = true;
            this.atMaxRight = false;
        } else if (this.right && (cellright || !celldiag)) {
            this.atMaxLeft = false;
            this.atMaxRight  = true;
        }
    
        this.falling = !(celldown || (nx && celldiag));
    };

    return phy;
}());