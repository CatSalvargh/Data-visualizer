
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainner = select('#app');
  var canvas = createCanvas(500, 300);
  // var x = windowWidth/4;
  // var y = windowHeight/4;
  // canvas.position(x, y);
  canvas.parent('app');

  canvas.style("border", "2px solid red");

  // Create a new gallery object.
  gallery = new Gallery();

  // Visualisation objects here.
  gallery.addVisual(new WorldPopHistoric());
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
}

function draw() {
  background(240);
  
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
