
class TestComponent {
    constructor() {
        this.name = "player";
        this.speed = 100;
        this.drag = 15;
        this.jump_force = 500;
        this.grounded = false;

        this.velocity = new Vector2(0, 0);
    }

    update() {
        let move = new Vector2( 0, 0 );
        if( Input.is_key_down( LEFT_ARROW ) )
            move.x = -1;
        else if( Input.is_key_down( RIGHT_ARROW ) )
            move.x = 1;

        /*
        if( Input.is_key_down( UP_ARROW ) )
            move.y = 1;
        else if( Input.is_key_down( DOWN_ARROW ) )
            move.y = -1;
        */

        if( this.grounded && Input.is_key_down_first_frame( UP_ARROW ) )
            this.velocity.y += this.jump_force;

        if( move.lenSq() > 0 )
            move = move.normalize();

        // apply movement
        this.velocity.x += move.x * this.speed;
        this.velocity.y += move.y * this.speed;

        // apply gravity
        this.velocity.y -= 980 * Timer.delta;

        // apply drag
        this.velocity.x = Math.sign( this.velocity.x ) * Math.max( ( Math.abs( this.velocity.x ) - this.drag ), 0 );
        // this.velocity.y = Math.sign( this.velocity.y ) * Math.max( ( Math.abs( this.velocity.y ) - this.drag ), 0 );

        let transform = this.owner.transform;
        transform.origin.x += this.velocity.x * Timer.delta;
        transform.origin.y += this.velocity.y * Timer.delta;

        if( transform.origin.x < 0 )
        {
            transform.origin.x = 0;
            this.velocity.x = 0;
        }
        if( transform.origin.x > width )
        {
            transform.origin.x = width;
            this.velocity.x = 0;
        }
        if( transform.origin.y < 0 )
        {
            transform.origin.y = 0;
            this.velocity.y = 0;
        }
        if( transform.origin.y > height )
        {
            transform.origin.y = height;
            this.velocity.y = 0;
        }

        this.grounded = transform.origin.y == 0;

        this.owner.transform.angle += Timer.delta;
    }
}

class PlayerComponent {
    constructor() {
        this.name = "player";
        this.speed = 100;

        this.velocity = new Vector2(0, 0);
    }

    update() {

    }
}

let scene_root = null;

function create_entity( name ) {
    let entity = new Entity( name );
    scene_root.transform.add_child( entity.transform );
    return entity;
}

function setup() {
    createCanvas( 800, 600 );

    Timer.init();
    Input.init();

    scene_root = new Entity( "root" );
    scene_root.add_component( new GridComponent( 16, 16 ) );
    
    let player = create_entity( "player" );
    player.add_component( new RectComponent( 40, 40 ) );
    player.add_component( new TestComponent() );
    player.transform.origin = new Vector2( width / 2, height / 2 );
    
    let playerHead = create_entity( "player_head" );
    playerHead.add_component( new CircleComponent( 40 ) );
    playerHead.transform.origin = new Vector2( 0, 80 );
    player.transform.add_child( playerHead.transform );

    let circle = create_entity( "circle" );
    circle.add_component( new CircleComponent( 40 ) );
    circle.transform.origin = new Vector2( width / 2, height / 2 );

}

function game_update() {
    Timer.tick();
    scene_root.update();
    Input.update();
}

function game_draw() {
    background( 128 );

    scale( 1, -1 );
    translate( 0, -height );
    scene_root.draw();
    translate( 0, height );
    scale( 1, -1 );

    textSize( 20 );
    text( "delta: " + Timer.delta, 10, 40 );
}

function draw() {
    game_update();
    game_draw();
}

function keyPressed() {
    return Input.keyPressed( keyCode );
}

function keyReleased() {
    return Input.keyReleased( keyCode );
}