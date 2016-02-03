class ComparativeRatingSummaryPage {
  static function SetUpPage(page, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    pageTemplate.Process("scorecard");
    pageTemplate.RedirectToComparativeRatingSetup();
  }
  
  static function CreateSummaryTable(table, report, state, log) {
    table.Caching.Enabled = false;
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var summaryTable = new ComparativeRatingSummaryTable(report, parameterUtilities, log);
    var expression = summaryTable.GetScorecardTableExpression();
    table.AddHeaders(report, Config.DS_Main, expression);
    var columnHeaders = summaryTable.CreateScorecardTableColumnHeaders();
    table.ColumnHeaders.AddRange(columnHeaders);
  }
  
  static function CreateSummaryHiddenTable(table, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var metaData = new MetaData(report, log);
    var summaryHiddenTable = new ComparativeRatingSummaryHiddenTable(report, parameterUtilities, metaData, log);
    var expression = summaryHiddenTable.GetHiddenTableExpression();
    table.AddHeaders(report, Config.DS_Main, expression);
  }
  
  static function HideComponent(state) {
    return state.Parameters.IsNull("SCORECARD_METRICS");
  }
}