class CrosstabPage {
  static function SetUpPage(page, report, state, pageContext, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    pageTemplate.Process("crosstab");
    pageTemplate.RedirectToCrosstabSetup();
    pageTemplate.SetNumberOfSelectionsToPageContext(pageContext, "QUESTION", "numberOfRows"); 
  }
  
  static function CreateCrosstabTable(table, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var metaData = new MetaData(report, log);
    var timeUtilities = new TimeUtilities(report, parameterUtilities, log);
    var crosstabTable = new CrosstabTable(report, table, parameterUtilities, metaData, timeUtilities, log);
    var tableExpression = crosstabTable.CreateTableExpression();
    table.AddHeaders(report, Config.DS_Main, tableExpression);
    crosstabTable.ApplySorting();
    crosstabTable.ReplaceTrendHeader();
    table.SignificanceTest = crosstabTable.CreateSignificanceTestSettings();
    table.Decimals = crosstabTable.GetTableDecimals();
    // Date Format (if week is selected)
    var trendUnit = parameterUtilities.GetParameterCode('CROSSTAB_TRENDING');
    if (trendUnit == '7' || trendUnit == '8') {
      TableUtil.UpdateDateFormatByTable(table);
    }
  }
}