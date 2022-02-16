/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Jörðin (sem teningur!) snýst um sólina (stærri teningur!).
//     Tunglið snýst í kringum jörðina.
//
//    Hjálmtýr Hafsteinsson, febrúar 2022
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var numVertices  = 36;

var points = [];
var colors = [];

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var rotYear = 0.0;
var rotDay = 0.0;
var yearVel = 0.1;
var dayVel = 1.0;

var earthTilt = 23.5;

var matrixLoc;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    matrixLoc = gl.getUniformLocation( program, "rotation" );

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );

    window.addEventListener("keydown", function(e){
      switch( e.keyCode ) {
          case 38:	// up arrow
              yearVel*=1.1;
              dayVel*=1.1;
              break;
          case 40:	// down arrow
              yearVel/=1.1;
              dayVel/=1.1;
              break;
      }
  } );


    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) 
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[a]);
        
    }
}
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    rotDay += dayVel;
    rotYear += yearVel;        // not the correct value, but looks better!

    var mv = mat4();
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) );

    // teikna "sólina"
    mv1 = mult( mv, scalem( 0.5, 0.5, 0.5 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // teikna "jörðina"
    mv1 = mult( mv1, rotateY( rotYear ) );
    mv1 = mult( mv1, translate( 1.8, 0.0, 0.0 ) );
    mv1 = mult( mv1, rotateZ( earthTilt ) );
    mv1 = mult( mv1, rotateY( rotDay ) );
    mv1 = mult( mv1, scalem( 0.2, 0.2, 0.2 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // teikna "tunglið"
    var mvt = mult( mv1, rotateY( 30.0*rotYear ) );
    mvt = mult( mvt, translate( 1.8, 0.0, 0.0 ) );
    mvt = mult( mvt, scalem( 0.4, 0.4, 0.4 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mvt));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    
    // teikna gervitunglið
    // teikna "sólina"
    mvg = mult( mv, scalem( 0.5, 0.5, 0.5 ) );
    

    // varpa i "jörðina"
    mvg = mult( mvg, rotateY( rotYear ) );
    mvg = mult( mvg, translate( 1.8, 0.0, 0.0 ) );
    mvg = mult( mvg, rotateZ( earthTilt ) );
    mvg = mult( mvg, rotateY( rotDay ) );
    mvg = mult( mvg, scalem( 0.2, 0.2, 0.2 ) );
    
    // varpa i "tunglið"
    mvg = mult( mvg, rotateY( 30.0*rotYear ) );
    mvg = mult( mvg, translate( 1.8, 0.0, 0.0 ) );
    mvg = mult( mvg, scalem( 0.4, 0.4, 0.4 ) );

    // varpa i "gervitunglid"
    mvg = mult( mvg, rotateY( 180 - 30.0*rotYear ) );
    mvg = mult( mvg, rotateZ(  30.0*rotYear ) );
    mvg = mult( mvg, translate( 1.8, 0.0, 0.0 ) );
    mvg = mult( mvg, scalem( 0.6, 0.6, 0.6 ) );
    
   

    gl.uniformMatrix4fv(matrixLoc, false, flatten(mvg));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );




    // gl.uniformMatrix4fv(matrixLoc, false, flatten(mvg));
    // gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    requestAnimFrame( render ); 
}

/*function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    rotDay += dayVel;
    rotYear += yearVel;        // not the correct value, but looks better!

    var mv = mat4();
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) );

    // teikna "sólina"
    mv1 = mult( mv, scalem( 0.5, 0.5, 0.5 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // teikna "jörðina"
    mv1 = mult( mv1, rotateY( rotYear ) );
    mv1 = mult( mv1, translate( 1.8, 0.0, 0.0 ) );
    mv1 = mult( mv1, rotateZ( earthTilt ) );
    mv1 = mult( mv1, rotateY( rotDay ) );
    mv1 = mult( mv1, scalem( 0.2, 0.2, 0.2 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // teikna "tunglið"
    var mvt = mult( mv1, rotateY( 30.0*rotYear ) );
    mvt = mult( mvt, translate( 1.8, 0.0, 0.0 ) );
    mvt = mult( mvt, scalem( 0.4, 0.4, 0.4 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mvt));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // teikna "gervitunglið"
    // byrjum með upp á nýtt til að fá réttan snúning
    var mvg = mult ( mv, scalem(0.5, 0.5, 0.5));
    
    
    // færa yfir í jörðina og snúa um sólina
    mvg = mult( mvg, rotateY( rotYear ) );
    mvg = mult ( mvg, translate( 1.8, 0.0, 0.0 ));
    mvg = mult( mvg, scalem( 0.2, 0.2, 0.2 ) );
   
    // færa yfir í tunglið og snúa um jörðina
    mvg = mult( mvg, rotateY( 30.0*rotYear ) );
    mvg = mult ( mvg, translate( 1.8, 0.0, 0.0 ));
    mv1 = mult( mv1, rotateZ( earthTilt ) );
    mv1 = mult( mv1, rotateY( rotDay ) );
    mvg = mult( mvg, scalem( 0.4, 0.4, 0.4 ) );

    // færa yfir í gervitunglið og snúa um tunglið
    // mvg = mult( mvg, rotateZ( 15.0*rotYear ) );
    // mvg = mult ( mvg, translate( 0.0, 1.8, 0.0 ));
    // mvg = mult( mvg, scalem( 0.8, 0.8, 0.8 ) );
    
    // snúningur um núllpunkt
    mvg = mult( mvg, rotateZ( earthTilt ) );
    // mvg = mult( mvg, rotateY( rotDay ) );
    // mvg = mult ( mvg, rotateX( -30.0*rotYear + 90 ));
    //mvg = mult ( mvg, scalem(0.5, 0.5, 0.5));


    
   

   // // teikna "gervitunglið"
   // var mvg = mult( mvt, rotateZ( 15.0*rotYear ) );
   // mvg = mult( mvg, translate( 1.8, 0.0, 0.0 ) );
   // mvg = mult( mvg, scalem( 0.4, 0.4, 0.4 ) );
//
   // // kominn í tunglið, sleppum snúningi tunglsins
   // mvg = mult( mvg, translate( -1.8, 0.0, 0.0 ) );
   // mvg = mult( mvg, rotateY (-30.0*rotYear));
   // mvg = mult( mvg, translate( 1.8, 0.0, 0.0 ) );
//
   // // viljum að hnöttur snúi 90 á við hinar sporbrautirnar.
   // // færa tilbaka í sólina (úr tunglinu), snúa um - earthTilt - 90
   // // auk þess sleppa snúningi jarðar og tungls, færa til baka
   // mvg = mult( mvg, translate( 3.6, 0.0, 0.0 ));
   // mvg = mult( mvg, rotateY( -rotDay ));
   // mvg = mult( mvg, rotateZ( -earthTilt - 90 ));
   // mvg = mult( mvg, translate( -3.6, 0.0, 0.0 ));
    
   // 
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mvg));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    requestAnimFrame( render );
}
*/