class TrendChart {
  private var _report;
  private var _chart;
  private var _parameterValues;
  private var _log;
  
  private const TableName = "TrendTable";
  
  function TrendChart(report, chart, parameterValues, log) {
    _report = report;
    _chart = chart;
    _parameterValues = parameterValues;
    _log = log;
  }
  
  function SetUpTrendChart() {
    SetXAxisProperties();
    ShowOrHideLabels();
    SetYAxisProperties();
    BarChartIfOnlyOneValue();
  }
  
  private function SetXAxisProperties() {  
    var columns = _report.TableUtils.GetRowValues(TableName, 1);
    var interval = Math.round(columns.length/20);
    if(interval == 0) {
      interval = 1;
    }
    _chart.ChartArea.PrimaryAxisX.LabelStyle.Interval = interval;
    _chart.ChartArea.PrimaryAxisX.MajorTickMark.Interval = interval;
    _chart.ChartArea.PrimaryAxisX.LabelStyle.ShowEndLabels = true;
    _chart.ChartArea.PrimaryAxisX.Maximum = columns.length-1;
  }
  
  private function ShowOrHideLabels() {
    var trendLabels = _parameterValues.TrendLabels;
    if(trendLabels != null && trendLabels == "2") {
      _chart.Series.SeriesDefault.ShowLabelAsValue = true;
    }
    else {
      _chart.Series.SeriesDefault.ShowLabelAsValue = false;
    }
  }
  
  private function SetYAxisProperties() {
    var statisticsCode = _parameterValues.StatisticsCode;
    var question = _parameterValues.Metric.Question;
    var yAxisMinimum = FindYAxisMinimum(question, statisticsCode);
    var yAxisMaximum = FindYAxisMaximum(question, statisticsCode);
    _log.LogDebug("yAxisMinimum: " + yAxisMinimum);
    _log.LogDebug("yAxisMaximum: " + yAxisMaximum);
    _chart.ChartArea.PrimaryAxisY.Minimum = yAxisMinimum;
    _chart.ChartArea.PrimaryAxisY.Maximum = yAxisMaximum;
  }
  
  private function FindYAxisMinimum(question, statisticsCode) {  
    var userSetMinimumValue = _parameterValues.UserSetMinimumValue;
    if(userSetMinimumValue != null) {
      return userSetMinimumValue;
    }
    switch (statisticsCode) {
      case "1":
        var scale = [];        
        switch (question.QuestionType) {
          case QuestionType.Single:
            var scale = question.Answers;
            break;      
          case QuestionType.Grid:
            var scale = question.Scale;
            break;
          default:
        }
        if(scale.length > 0) {
          var min;
          for (var i = 0; i < scale.length; ++i) {
            var score = scale[i].Score;
            min = (min==null) ? score : Math.min(min, score); 
          }      
        }
    	//return min;
        return undefined;
      case "2":
        return undefined;
      case "0":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
        return undefined; 
      case "9":
       	return undefined;
    }
  }
  
  private function FindYAxisMaximum(question, statisticsCode) {
    var userSetMaximumValue = _parameterValues.UserSetMaximumValue;
    if(userSetMaximumValue != null) {
      return userSetMaximumValue;
    }
    switch (statisticsCode) {
      case "1":
      case "2":
        var scale = [];        
        switch (question.QuestionType) {
          case QuestionType.Single:
            var scale = question.Answers;
            break;      
          case QuestionType.Grid:
            var scale = question.Scale;
            break;
          default:
        }
        if(scale.length > 0) {
          var max;
          for (var i = 0; i < scale.length; ++i) {
            var score = scale[i].Score;
            max = (max==null) ? score : Math.max (max, score); 
          }      
        }
    	//return max;
        return undefined;
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        return undefined; 
    }
  }
  
  private function BarChartIfOnlyOneValue() {
    var values = _report.TableUtils.GetRowValues(TableName, 1);
    _chart.Series.SeriesDefault.ChartType = (values.length <= 1) ? ChartTypes.Column : ChartTypes.Line; 
  }
}