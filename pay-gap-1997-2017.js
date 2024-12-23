function PayGapTimeSeries() {

  this.name = 'Pay gap: 1997-2017';
  this.id = 'pay-gap-timeseries';
  this.loaded = false;

  this.title = 'Gender Pay Gap: Average difference between male and female pay.'; // Title above the plot.

  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and methods.
  this.layout = {
      marginSize: marginSize,

      // Margins around the plot. Left/bottom ++space for axis and tick labels
      leftMargin: marginSize * 2,
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
      numXTickLabels: 10,
      numYTickLabels: 8,
  };

  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      });  // Callback function: loaded to true.

  };

  this.setup = function() {
    textSize(16);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = this.data.getNum(0, 'year');
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, 'year');

    // Find min and max pay gap for mapping to canvas height.
    this.minPayGap = 0;         // Pay equality (zero pay gap).
    this.maxPayGap = max(this.data.getColumn('pay_gap'));
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
    drawYAxisTickLabels(this.minPayGap,
                        this.maxPayGap,
                        this.layout,
                        this.mapPayGapToHeight.bind(this),
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
        year: this.data.getNum(i, 0),
        payGap: this.data.getNum(i, 3)
      };

      if (previous != null) {
        // Draw line segment connecting previous year to current
        stroke(0);
        line(
          this.mapYearToWidth(previous.year), this.mapPayGapToHeight(previous.payGap),
          this.mapYearToWidth(current.year), this.mapPayGapToHeight(current.payGap)
        );

        // The number of x-axis labels to skip so that only numXTickLabels are drawn.
        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 0) {
          drawXAxisTickLabel(previous.year, this.layout,
                             this.mapYearToWidth.bind(this));
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

  this.mapPayGapToHeight = function(value) {
    return map(value, 
      this.minPayGap,
      this.maxPayGap,
      this.layout.bottomMargin,
      this.layout.topMargin
    )
  };
}
