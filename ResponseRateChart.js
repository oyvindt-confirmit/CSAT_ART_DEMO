class ResponseRateChart {
  private var _report;
  private var _chart;
  private var _parameterUtilities;
 
  function ResponseRateChart(report, chart, parameterUtilities) {
    _report = report;
    _chart = chart;
    _parameterUtilities = parameterUtilities;
  }
  
  function SetChartProperties() {
    SetXAxisProperties();
    SetShowLabels();
  }
  
  private function SetXAxisProperties() {
    var rows = _report.TableUtils.GetColumnValues(Settings.ResponseRatePage.TableName, 1);
    var interval = Math.round(rows.length/20);
    if(interval == 0) {
      interval = 1;
    }
    _chart.ChartArea.PrimaryAxisX.LabelStyle.Interval = interval;
    _chart.ChartArea.PrimaryAxisX.MajorTickMark.Interval = interval;
    _chart.ChartArea.PrimaryAxisX.LabelStyle.ShowEndLabels = true;
    _chart.ChartArea.PrimaryAxisX.Maximum = rows.length-2
  }
  
  private function SetShowLabels() {
    var responseRateLabeld = _parameterUtilities.GetParameterString(Settings.ResponseRatePage.Labels);
    if(responseRateLabeld == "2") {
      _chart.Series.SeriesDefault.ShowLabelAsValue = true;
    }
    else {
      _chart.Series.SeriesDefault.ShowLabelAsValue = false;
    }
  }
}