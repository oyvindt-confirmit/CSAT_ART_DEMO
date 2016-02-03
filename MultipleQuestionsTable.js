public class MultipleQuestionsTable {
  private var _report;
  private var _table;
  private var _variableIds;
  private var _question;
  private var _questions;
  private var _metaData;
  private var _log;
  
  function MultipleQuestionsTable(report, table, variableIds, metaData, log) {
    _report = report;
    _table = table;
    _variableIds = variableIds;
    _metaData = metaData;
    _questions = [];
    for(var i = 0; i < variableIds.length; ++i) {
      _questions.push(GetQuestion(variableIds[i])); 
    }
    _log = log;
  }
  
  private function GetQuestion(variableId) {
    var variableSections = variableId.split('.');
    var questionId = variableSections[0];
    var question = _metaData.GetQuestion(Config.DS_Main, questionId, true);
    return question;
  }
  
  function CreateTableExpression() { 
    var rowExpression = CreateRowExpression();
    var columnExpression = CreateColumnExpression();
    var tableExpression = [rowExpression, columnExpression].join('^');
    return tableExpression;
  }
  
  private function CreateRowExpression() {
    var rowExpression = [];
    for(var i = 0; i < _questions.length; ++i) {
      var headerQuestionProperties = GetHeaderQuestionProperties(_questions[i]);
      rowExpression.push(_variableIds[i] + '{' + headerQuestionProperties + '}');
    }
    return rowExpression.join("+");
  }
      
  private function GetHeaderQuestionProperties(question) {
    var headerQuestionProperties = [];
    headerQuestionProperties.push("title:true");
    headerQuestionProperties.push("totals:true");
    switch (question.QuestionType) {
      case QuestionType.Multi:
        headerQuestionProperties.push("collapsed:true");
        break;
      default:
        headerQuestionProperties.push("collapsed:false");
        break;
    }
    if(QuestionProperties.IsInCategory(question, "sort")) {
      headerQuestionProperties.push("sort:sortEnabled,desc");
    }
    if(QuestionProperties.HasScores(question)) {
      headerQuestionProperties.push("statistics:avg,stdev");
    }
    return headerQuestionProperties.join(";");
  }
  
  private function CreateColumnExpression() {
    return '[Base]+[SEGMENT]{label:"Pct"}';
  }

  function ApplySorting(rowHeaderPosition, sortPosition) {
    TableUtil.ApplySorting(_table, _question, 0, 2);
  }
  
  function AddChartColumn() {
    _log.LogDebug("AddChartColumn 1");
    var rowCount = GetRowCount();
    _log.LogDebug("AddChartColumn 2: " + rowCount);
    TableUtil.AddFrontChartColumn(_report, _table, rowCount, _log);
    _log.LogDebug("AddChartColumn 3");
  }
  
  private function GetRowCount() {
    var answers;
    switch (_question.QuestionType) {
      case QuestionType.Grid:
        answers = _question.Scale;
   	    break; 
      default:
  	    answers = _question.Answers;  
    }
    return (answers.length + 1);
  }
  
  function ApplySortingToRows() {
    for(var j = 0; j < _table.RowHeaders.Count; j++) {
      var rowHeader : Header = _table.RowHeaders[j];
      if(rowHeader.Sorting.Direction === TableSortDirection.Descending) {
        rowHeader.Sorting.Enabled = true;
      }
    }
  }
}