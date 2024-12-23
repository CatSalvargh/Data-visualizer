function PayGapByJob2017() {
  this.name = 'Pay gap by job: 2017';
  this.id = 'pay-gap-by-job-2017';
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      }); // Callback function: loaded to true.

  };

  this.setup = function() {
  };

  this.destroy = function() {
  };

  this.draw = function() {
      if (!this.loaded) {
        console.log('Data not yet loaded');
        return;
      }

      this.addAxes(); // Draw the axes.
      // Get data from the table object.
      var jobs = this.data.getColumn('job_subtype'); // CHECK IF THIS VAR IS USED
      var propFemale = this.data.getColumn('proportion_female');
      var payGap = this.data.getColumn('pay_gap');
      var numJobs = this.data.getColumn('num_jobs');

      // Convert numerical data from strings to numbers.
      propFemale = stringsToNumbers(propFemale);
      payGap = stringsToNumbers(payGap);
      numJobs = stringsToNumbers(numJobs);

      // Set ranges for axes.
      // Use full 100% for x-axis (proportion of women in roles).
      var propFemaleMin = 0;
      var propFemaleMax = 100;

      // For y-axis (pay gap) use a symmetrical axis equal to the
      // largest gap direction so that equal pay (0% pay gap) is in the
      // centre of the canvas. Above the line means men are paid
      // more. Below the line means women are paid more.
      var payGapMin = -20;
      var payGapMax = 20;

      // Find smallest and largest numbers of people across all
      // categories to scale the size of the dots.
      var numJobsMin = min(numJobs);
      var numJobsMax = max(numJobs);

      fill(255);
      stroke(0);
      strokeWeight(1);

      for (i = 0; i < this.data.getRowCount(); i++) {
        x = map(propFemale[i],
          propFemaleMin, 
          propFemaleMax,
          this.pad,
          width - this.pad
        );

        y = map(payGap[i],
          payGapMin,
          payGapMax,
          height - this.pad,
          this.pad
        );

        size = map(numJobs[i],
          numJobsMin,
          numJobsMax,
          10, 
          50
        )
        ellipse(
          x,
          y, 
          size
        );
        
      
      }
    };

  this.addAxes = function () {
      stroke(200);
      line(width / 2, 0 + this.pad, width / 2, height - this.pad); // vertical
      line(0 + this.pad, height / 2, width - this.pad, height / 2); //horizontal
    };
  
}
