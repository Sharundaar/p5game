class Transform {
    constructor() {
        this.name = "transform";
        this.children = [];
        this.parent = null;

        this.origin = new Vector2( 0, 0 );
        this.angle = 0;
    }

    add_child( child ) {
        if( child.parent != this && child.parent != null )
            child.parent.remove_child( child );
        this.children.push( child );
        child.parent = this;
    }

    remove_child( child ) {
        const idx = this.children.indexOf( child );
        if( idx > -1 ) {
            this.children.splice( idx );
            child.parent = null;
        }
    }

    push() {
        translate( this.origin.x, this.origin.y );
        rotate( this.angle );
    }

    pop() {
        rotate( -this.angle );
        translate( -this.origin.x, -this.origin.y );
    }

    destroy() {
        for( let child of this.children )
            child.owner.destroy();
        if( this.parent != null )
            this.parent.remove_child( this );
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
        circle( 0, 0, this.radius );
    }
}

class RectComponent {
    constructor( w, h ) {
        this.name = "rect";
        this.w = w;
        this.h = h;
    }

    draw() {
        rect( -this.w / 2, -this.h / 2, this.w, this.h );
    }
}

class GridComponent {
    constructor( xspan, yspan ) {
        this.span = new Vector2( xspan, yspan );
    }

    draw() {
        fill( 0 );
        let x = this.span.x;
        while( x < width ) {
            line( x, 0, x, height );
            x += this.span.x;
        }
        let y = this.span.y;
        while( y < height ) {
            line( 0, y, width, y );
            y += this.span.y;
        }
        fill( 255 );
    }
}

class Entity {
    constructor( name ) {
        this.name = name;

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
        const idx = this.components.indexOf( component );
        if( idx > -1 ) {
            if( typeof( component.destroy ) == "function" )
                component.destroy();
            this.components.splice( idx );
        }
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
        for( let child of this.transform.children )
            child.owner.update();
    }

    draw() {
        this.transform.push();
        for( let component of this.components ) {
            if ( typeof( component.draw ) == "function" )
                component.draw();
        }
        for( let child of this.transform.children ) {
            child.owner.draw();
        }

        this.transform.pop();
    }

    destroy() {
        for( let component of this.components ) {
            if( typeof( component.destroy ) == "function" )
                component.destroy();
        }
        this.component = null;
    }
}