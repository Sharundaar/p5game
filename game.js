
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

class Transform {
    constructor() {
        this.name = "transform";

        this.origin = new Vector2( 0, 0 );
        this.angle = 0;
    }

    push() {
        translate( this.origin.x, this.origin.y );
        rotate( this.angle );
    }

    pop() {
        rotate( -this.angle );
        translate( -this.origin.x, -this.origin.y );
    }
}

class CircleComponent {
    constructor( radius ) {
        this.name = "circle";
        if( radius == null )
            this.radius = 20;
        else
            this.radius = radius;
    }

    draw() {
        this.owner.transform.push();
        circle( 0, 0, this.radius );
        this.owner.transform.pop();
    }
}

class RectComponent {
    constructor( w, h ) {
        this.name = "rect";
        this.w = w;
        this.h = h;
    }

    draw() {
        this.owner.transform.push();
        rect( -this.w / 2, -this.h / 2, this.w, this.h );
        this.owner.transform.pop();
    }
}

class PlayerComponent {
    constructor() {
        this.name = "player";
    }

    update() {
        this.owner.transform.angle += Timer.delta;
    }
}

class Entity {
    constructor() {
        this.components = [];

        this.transform = new Transform();
        this.add_component( this.transform );
    }

    add_component( component ) {
        component.owner = this;
        this.components.push( component );

        if ( typeof( component.setup ) == "function" ) component.setup();
        return this;
    }

    remove_component( component ) {

    }

    get_component( type ) {
        for( let component of this.components ) {
            if( component.name == type ) return component;
        }
        return null;
    }

    update() {
        for( let component of this.components ) {
            if ( typeof( component.update ) == "function" ) component.update();
        }
    }

    draw() {
        for( let component of this.components ) {
            if ( typeof( component.draw ) == "function" )
                component.draw();
        }
    }
}

let entities = [];

function setup() {
    createCanvas( 800, 600 );

    Timer.init();

    let player = new Entity();
    player.add_component( new RectComponent( 40, 40 ) );
    player.add_component( new PlayerComponent() );
    player.transform.origin = new Vector2( width / 2, height / 2 );

    entities.push( player );

    let circle = new Entity();
    circle.add_component( new CircleComponent( 40 ) );
    circle.transform.origin = new Vector2( width / 2, height / 2 );
    entities.push( circle );
}

function update() {
    for( let entity of entities )
        entity.update();
}

function draw() {
    Timer.tick();
    update();

    background( 128 );

    scale( 1, -1 );
    translate( 0, -height );
    for( let entity of entities )
        entity.draw();
    translate( 0, height );
    scale( 1, -1 );

    textSize( 20 );
    text( "delta: " + Timer.delta, 10, 40 );
}