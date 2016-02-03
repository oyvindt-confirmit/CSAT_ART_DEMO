class ResponseRateChart {
  private var _report;
  private var _chart;
  private var _parameterValues;
  private var _log;
 
  function ResponseRateChart(chart, report, parameterValues, log) {
    _report = report;
    _chart = chart;
    _parameterValues = parameterValues;
    _log = log;
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
    _chart.ChartArea.PrimaryAxisX.Maximum = rows.length - 2
  }
  
  private function SetShowLabels() {
    if(_parameterValues.Labels && _parameterValues.Labels !== null && _parameterValues.Labels === "2") {
      _chart.Series.SeriesDefault.ShowLabelAsValue = true;
    }
    else {
      _chart.Series.SeriesDefault.ShowLabelAsValue = false;
    }
  }
}