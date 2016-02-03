class OverviewPage {
  static function SetUpPage(page, report, state, log) {
    var pageId = "overview";
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    pageTemplate.Process(pageId);
  }
  
  static function CreateReportSummary(text, report, log) {
    var reportSummary = new ReportSummary(report, log);
    text.Output.Append(reportSummary.CreateSummaryJavascript());
  }
}