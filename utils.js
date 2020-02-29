class Vector2 {
    constructor( x, y ) {
        this.x = x;
        this.y = y;
    }

    add( v ) {
        return new Vector2( this.x + v.x, this.y + v.y );
    }

    sub( v ) {
        return new Vector2( this.x - v.x, this.y - v.y );
    }

    dot( v ) {
        return this.x * v.x + this.y * v.y;
    }

    lenSq() {
        return this.x * this.x + this.y * this.y;
    }

    len() {
        return Math.sqrt( this.lenSq() );
    }

    normalize() {
        const len = this.len();
        return new Vector2( this.x / len, this.y / len );
    }
}

class Timer {
    static get last_tick() { return this._last_tick; }
    static set last_tick( value ) { this._last_tick = value; }
    static get delta() { return this._delta; }
    static set delta( value ) { this._delta = value; }
    static init() {
        this.last_tick = millis();
        this.delta = 0;
    }
    static tick() {
        this.delta = ( millis() - this.last_tick ) / 1000;
        this.last_tick = millis();
    }
}

class Input {
    static keyPressed( key ) {
        this.pressed_key[key] = true;
    }

    static keyReleased( key ) {
        this.pressed_key[key] = false;
    }

    static init() {
        this.pressed_key = [];
    }

    static update() {

    }

    static is_key_down( key ) {
        return this.pressed_key[key] === true;
    }
}
