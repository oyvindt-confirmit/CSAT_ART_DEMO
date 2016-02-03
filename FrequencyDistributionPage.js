class FrequencyDistributionPage {
  static function SetUpPage(page, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    pageTemplate.Process("frequency_distribution");
    pageTemplate.SetUpPreviousNextNavigation("ONE_QUESTION");
  }
  
  static function CreateQuestionText(text, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var variableId = parameterUtilities.GetParameterCode('ONE_QUESTION');
    var questionId = variableId.split('.')[0];
    var metaData = new MetaData(report, log);
    var question = metaData.GetQuestion(Config.DS_Main, questionId, false);

    if(question) {
      var outputText = [];
      var titleText = [];
      titleText.push('<h4><span class=VariableId>' + variableId + '</span>');
      titleText.push('<span class=QuestionText>' + TextUtilities.CleanText(question.Title) + '</span></h4>');
      outputText.push(titleText.join(' > '));
      if(question.Text != null) {
        outputText.push(TextUtilities.CleanText(question.Text));
      }
      if(question.QuestionType == QuestionType.Grid) {
        var answer = QuestionProperties.GetAnswer(question, variableId.split('.')[1]);
        outputText.push ('<div style="margin-top:12px"><i>' + TextUtilities.CleanText(answer.Text) + '</i></div>');
      }
      text.Output.Append(outputText.join('<br>'));
    }
  }
  
  static function CreateFrequencyDistributionTable(table, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var variableId = parameterUtilities.GetParameterCode("ONE_QUESTION");
    var metaData = new MetaData(report, log);
    var questionTable = new IndividualQuestionsTable(report, table, variableId, metaData, log);
    var tableExpression = questionTable.CreateTableExpression();
    table.AddHeaders(report, Config.DS_Main, tableExpression);
    questionTable.ApplySorting(0, 2);
    questionTable.AddChartColumn();
    if(state.ReportExecutionMode == ReportExecutionMode.PowerPointExport || state.ReportExecutionMode == ReportExecutionMode.ExcelExport) {
      table.Title.Enabled = true;
    }
  }
}