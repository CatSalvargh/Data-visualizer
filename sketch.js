
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainner = select('#app');
  var c = createCanvas(820, 450);
  c.parent('app');
  // var x = (windowWidth - 1000) / 2;
  // var y = (windowHeight - height) / 2;
  // c.position(x, y);

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  gallery.addVisual(new WorldPopHistoric());
}

function draw() {
  background(240);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
