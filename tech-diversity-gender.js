function TechDiversityGender() {
  this.name = 'Tech Diversity: Gender';
  this.id = 'tech-diversity-gender';
  this.loaded = false;

  // Layout object to store all common plot layout parameters and methods.
  this.layout = {
      // Margins around the plot. Left/bottom ++space for axis and tick labels
      leftMargin: 130,
      rightMargin: width,
      topMargin: 30,
      bottomMargin: height,
      pad: 5,
      plotWidth: function() {
        return this.rightMargin - this.leftMargin;
      },
      
      grid: true,// Boolean to enable/disable background grid.
      // Number of axis tick labels to draw so that they are not drawn on top of one another.
      numXTickLabels: 10,
      numYTickLabels: 8,
  };

  // Middle of the plot: for 50% line.
  this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;

  // Default visualisation colours.
  this.femaleColour = color(255, 0 ,0);
  this.maleColour = color(0, 255, 0);

  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/tech-diversity/gender-2018.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      }); // Callback function: loaded to true.
  };

  this.setup = function() {
    textSize(16);
  };

  this.destroy = function() {
  };

  this.draw = function() {
      if (!this.loaded) {
        console.log('Data not yet loaded');
        return;
      }
      // Draw Female/Male labels at the top of the plot.
      this.drawCategoryLabels();

      var lineHeight = (height - this.layout.topMargin) /
          this.data.getRowCount();

          // Loop over every row in the data.
      for (var i = 0; i < this.data.getRowCount(); i++) {
        // Calculate company y position
        var lineY = (lineHeight * i) + this.layout.topMargin;
        // Create an object that stores data from the current row.
        var company = {
            name: this.data.getString(i, 0),
            female: this.data.getNum(i, 1),
            male: this.data.getNum(i, 2)
          };
  
        // Draw the company name in the left margin.
        fill(0);
        noStroke();
        textAlign('right', 'top');
        text(company.name,
            this.layout.leftMargin - this.layout.pad,
            lineY);

        // Draw female employees rectangle.
        fill(this.femaleColour);
        rect(this.layout.leftMargin,
            lineY,
            this.mapPercentToWidth(company.female),
            lineHeight - this.layout.pad);

        // Draw male employees rectangle.
        fill(this.maleColour);
        rect(this.layout.rightMargin,
            lineY,
            this.mapPercentToWidth(-company.male),
            lineHeight - this.layout.pad);
      }

      // Draw 50% line
      stroke(150);
      strokeWeight(1);
      line(this.midX,
          this.layout.topMargin,
          this.midX,
          this.layout.bottomMargin);
    };

  this.drawCategoryLabels = function() {
    fill(0);
    noStroke();
    textAlign('left', 'top');
    text('Female',
        this.layout.leftMargin,
        this.layout.pad);
    textAlign('center', 'top');
    text('50%',
        this.midX,
        this.layout.pad);
    textAlign('right', 'top');
    text('Male',
        this.layout.rightMargin,
        this.layout.pad);
  };

  this.mapPercentToWidth = function(percent) {
    return map(percent,
              0,
              100,
              0,
              this.layout.plotWidth());
  };
}
