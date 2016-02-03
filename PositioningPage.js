class PositioningPage {
  static function SetUpPage(page, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    pageTemplate.Process("positioning");
    pageTemplate.RedirectToPositioningSetup();
  }
  
  static function CreatePostioningClientSideScript(text, report, state, log) {
    var metaData = new MetaData(report, log);
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var quadrantChartProperties = new QuadrantChartProperties(metaData, parameterUtilities, log);
    var postioningTable = new PositioningTable(parameterUtilities, log);
    var expression = postioningTable.CreateStatisticsTableExpression();
    var json = report.TableUtils.GenerateTableFromExpression(Config.DS_Main, expression, TableFormat.Json);
    var quadrantChart = new QuadrantChart(json, quadrantChartProperties.properties, log);
    var dataSeries = quadrantChart.GetQuadrantChartDataSeries();
    text.Output.Append("<script>var dataSeries = " + dataSeries + ";</script>\n");
    text.Output.Append("<script>var quadrantChartConfig = " + RE.JSONstringify(quadrantChartProperties.properties, log) + ";</script>\n");
  }
}