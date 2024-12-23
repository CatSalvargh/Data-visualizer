function TechDiversityRace() {

  this.name = 'Tech Diversity: Race';
  this.id = 'tech-diversity-race';
  this.loaded = false;

  // Preload data. Ccalled by the gallery when a vis is added.
  this.preload = function() {
      var self = this;
      this.data = loadTable(
        './data/tech-diversity/race-2018.csv', 'csv', 'header',
        function(table) {
          self.loaded = true;
        }); // Callback function: loaded to true.
  };

  this.setup = function() {
      if (!this.loaded) {
        console.log('Data not yet loaded');
        return;
      }

      // Create a select DOM element.
      this.select = createSelect();
      this.select.position(width / 2, 100);

      for (var i = 1; i < this.data.columns.length; i++){
          this.select.option(this.data.columns[i]);
      }
  };

    this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    // Use a temporary hard-code example for now.
  
    var companyName = this.select.selected();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(companyName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow'];

    // Make a title.
    var title = 'Employee diversity at ' + companyName;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);

  };
}
