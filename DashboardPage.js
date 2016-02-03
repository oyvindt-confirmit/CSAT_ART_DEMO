class DashboardPage {
  static function CreateChartTitle(text, pageContext, chartNumber) {
    var chartTitle = pageContext.Items["dashboardComponents"].CreateDashboardChartTitle(chartNumber);
    text.Output.Append(chartTitle);
  }
  
  static function SetUpDashboardChart(chart, state, pageContext, chartNumber) {
    var dashboardPage = pageContext.Items["dashboardComponents"];
    dashboardPage.DisplayLegend(chart, chartNumber);
    dashboardPage.AddChartTitleOnExport(chart, state, chartNumber);
    dashboardPage.AddCountLabel(chart, chartNumber);
  }
  
  static function SetUpDashboardTable(table, pageContext, chartNumber) {
    var dashboardPage = pageContext.Items["dashboardComponents"];
    dashboardPage.CreateDashboardTable(table, chartNumber);
  }
  
  static function HideDashboardComponent(pageContext, dashboardNumber) {
    return pageContext.Items["dashboardComponents"].HideDashboard(dashboardNumber);
  }
  
  static function CreateClientSideScript(text, report, pageContext, log) {
    var numberOfDashboards = ReportMetaData.GetDashboardQuestions(report, Config.DS_Main, log).length;
    var gaugeCharts = pageContext.Items["dashboardComponents"].GetGaugeProperties();
    var dashboardPageScript = [];
    dashboardPageScript.push("<script>");
    dashboardPageScript.push("for(var i = " + numberOfDashboards + " + 1; i <= 6; ++i) {");
    dashboardPageScript.push("  jQuery('#panel' + i).addClass('hidden');");
    dashboardPageScript.push("}");
    dashboardPageScript.push("var gaugeChartProperties = " + RE.JSONstringify(gaugeCharts) + ";");
    dashboardPageScript.push("</script>");
    text.Output.Append(dashboardPageScript.join("\n"));
  }
  
  static function HidePage(report, log) {
    return (ReportMetaData.GetDashboardQuestions(report, Config.DS_Main, log).length == 0);
  }
  
  static function SetUpPage(page, report, state, pageContext, log) {
    var pageId = "dashboard";
    var metaData = new MetaData(report, log);
    var dashboardComponents = new DashboardComponents(report, metaData, log);
    pageContext.Items.Add("dashboardComponents", dashboardComponents);

    var parameterUtilities = new ParameterUtilities(report, state, log);
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    pageTemplate.Process(pageId);
  }
}