class FrequencyDistributionMultiplePage {
  static function SetUpPage(page, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    pageTemplate.Process("frequency_distribution_multi");
  }
  
  static function CreateFrequencyDistributionMutipleTable(table, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var variableIds = parameterUtilities.GetParameterCodes("QUESTIONS");
    var metaData = new MetaData(report, log);
    var questionTable = new MultipleQuestionsTable(report, table, variableIds, metaData, log);
    var tableExpression = questionTable.CreateTableExpression();
    table.AddHeaders(report, Config.DS_Main, tableExpression);
    questionTable.ApplySortingToRows();
    if(state.ReportExecutionMode == ReportExecutionMode.PowerPointExport || state.ReportExecutionMode == ReportExecutionMode.ExcelExport) {
      table.Title.Enabled = true;
    }
  }
  
  static function IsQuestionsSelected(state) {
    return state.Parameters.IsNull("QUESTIONS");
  }
}