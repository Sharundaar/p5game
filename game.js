
class TestComponent {
    constructor() {
        this.name = "player";
        this.speed = 100;

        this.velocity = new Vector2(0, 0);
    }

    update() {
        this.velocity.x = 0;
        this.velocity.y = 0;

        if( Input.is_key_down( LEFT_ARROW ) )
            this.velocity.x -= this.speed;
        else if( Input.is_key_down( RIGHT_ARROW ) )
            this.velocity.x += this.speed;
        if( Input.is_key_down( UP_ARROW ) )
            this.velocity.y += this.speed;
        else if( Input.is_key_down( DOWN_ARROW ) )
            this.velocity.y -= this.speed;
        this.owner.transform.angle += Timer.delta;

        this.owner.transform.origin.x += this.velocity.x * Timer.delta;
        this.owner.transform.origin.y += this.velocity.y * Timer.delta;
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
    Input.update();
    scene_root.update();
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
    Input.keyPressed( keyCode );
}

function keyReleased() {
    Input.keyReleased( keyCode );
}