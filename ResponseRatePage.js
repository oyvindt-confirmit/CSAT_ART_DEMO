class ResponseRatePage { 
  static function CreateResponseRateTable(table, report, pageContext, log) {
    var parameterValues = pageContext.Items["ParameterValues"];

    var timeseriesHeader = new TimeSeriesHeader(table, parameterValues, log);
    var responseRateTable = new ResponseRateTable(table, report, timeseriesHeader, log);
    responseRateTable.CreateResponseRateTable();
    responseRateTable.PostTableGenerationProcessing();
  }
  
  static function CreateResponseRateTableForChart(table, report, pageContext, log) {
    var parameterValues = pageContext.Items["ParameterValues"];

    var timeseriesHeader = new TimeSeriesHeader(table, parameterValues, log);
    var responseRateTable = new ResponseRateTable(table, report, timeseriesHeader, log);
    responseRateTable.CreateResponseRateTableForChart();
    responseRateTable.PostTableGenerationProcessing();
    responseRateTable.SetResponseRateTableForChartValues();
  }
  
  static function CreateResponseRateChart(chart, report, pageContext, log) {
    var parameterValues = pageContext.Items["ParameterValues"];

    var responseRateChart = new ResponseRateChart(chart, report, parameterValues, log);
    responseRateChart.SetChartProperties();
  }
  
  static function SetUpPage(page, report, state, pageContext, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    pageTemplate.Process("responseRate");
    GetParameterValues(pageContext, parameterUtilities);
  }
  
  static function GetParameterValues(pageContext, parameterUtilities) {
    var parameterValues = {
      Unit: parameterUtilities.Selected(Settings.ResponseRatePage.UnitName),
      Interval: parameterUtilities.Selected(Settings.ResponseRatePage.IntervalName),
      Labels: parameterUtilities.GetParameterString(Settings.ResponseRatePage.Labels)
    }
    pageContext.Items.Add("ParameterValues", parameterValues);
  }
}