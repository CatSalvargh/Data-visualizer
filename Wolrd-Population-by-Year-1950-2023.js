function WorldPopHistoric() {

    this.name = 'World Population 1950 to 2023';
    this.id = 'Global_world_Population_historic';
    this.loaded = false;
  
    this.title = 'World Population 1950 to 2023'; // Title above the plot.
  
    this.xAxisLabel = 'Year';
    this.yAxisLabel = 'Billions of people';
  
    var marginSize = 35;
  
    // Layout object to store all common plot layout parameters and methods.
    this.layout = {
        marginSize: marginSize,
  
        // Margins around the plot. Left/bottom ++space for axis and tick labels
        leftMargin: marginSize * 3,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,
  
        plotWidth: function() {
          return this.rightMargin - this.leftMargin;
        },
  
        plotHeight: function() {
          return this.bottomMargin - this.topMargin;
        },
  
        grid: true, // Boolean to enable/disable background grid.
  
        // Number of axis tick labels to draw so that they are not drawn on top of one another.
        numXTickLabels: 15,
        numYTickLabels: 8,
    };
  
    this.preload = function() {
      var self = this;
      this.data = loadTable(
        '/data/world-population/population-historic-global-continents.csv', 'csv', 'header',
        function(table) {
          self.loaded = true;
        });  // Callback function: loaded to true.
  
    };
  
    this.setup = function() {
      textSize(12);
      // Set min and max years: assumes data is sorted by date.
      this.startYear = this.data.getNum(0, 'year');
      this.endYear = this.data.getNum(this.data.getRowCount() - 1, 'year');
  
      // Find min and max pay gap for mapping to canvas height.
      this.minPopulation = 0;   // Pay equality (zero pay gap).
      this.maxPopulation = max(this.data.getColumn('population'));
    };
  
    this.destroy = function() {
    };
  
    this.draw = function() {
      if (!this.loaded) {
        console.log('Data not yet loaded');
        return;
      }
  
      this.drawTitle(); // Draw the title above the plot.
  
      // Draw all y-axis labels. helper func
      drawYAxisTickLabels(this.minPopulation,
                          this.maxPopulation,
                          this.layout,
                          this.mapPopulationToHeight.bind(this),
                          0);
  
      // Draw x and y axis. helper func
      drawAxis(this.layout);
  
      // Draw x and y axis labels. helper func
      drawAxisLabels(this.xAxisLabel,
                     this.yAxisLabel,
                     this.layout);
  
      // Plot all pay gaps between startYear and endYear using the width
      // of the canvas minus margins.
      var previous;
      var numYears = this.endYear - this.startYear;
  
      // Loop over all rows and draw a line from previous value to the current.
      for (var i = 0; i < this.data.getRowCount(); i++) {
  
        // Create an object to store data for the current year.
        var current = {
          year: this.data.getNum(i, 'year'),
          Population: this.data.getNum(i, 'population')
        };
  
        if (previous != null) {
          // Draw line segment connecting previous year to current
          stroke(255,0,0);
          strokeWeight(3)
          line(
            this.mapYearToWidth(previous.year), this.mapPopulationToHeight(previous.Population),
            this.mapYearToWidth(current.year), this.mapPopulationToHeight(current.Population)
          );
  
          
          
          
          // The number of x-axis labels to skip so that only numXTickLabels are drawn.
          var xLabelSkip = ceil(int(numYears / this.layout.numXTickLabels));
  
          // Draw the tick label marking the start of the previous year.
          if (i % xLabelSkip == 0) {
            strokeWeight(1)
            drawXAxisTickLabel(previous.year, this.layout,
                               this.mapYearToWidth.bind(this));
            ellipse(this.mapYearToWidth(previous.year), this.mapPopulationToHeight(previous.Population), 7, 7);
          }
        }
  
        // Assign current year to previous year so that it is available
        // during the next iteration of this loop to give us the start
        // position of the next line segment.
        previous = current;
      }
    };
  
    this.drawTitle = function() {
      fill(0);
      noStroke();
      textAlign('center', 'center');
  
      text(this.title,
           (this.layout.plotWidth() / 2) + this.layout.leftMargin,
           this.layout.topMargin - (this.layout.marginSize / 2));
    };
  
    this.mapYearToWidth = function(value) {
      return map(value,
                 this.startYear,
                 this.endYear,
                 this.layout.leftMargin,   // Draw left-to-right from margin.
                 this.layout.rightMargin);
    };
  
    this.mapPopulationToHeight = function(value) {
      return map(value, 
        this.minPopulation,
        this.maxPopulation,
        this.layout.bottomMargin,
        this.layout.topMargin
      )
    };
  }
  