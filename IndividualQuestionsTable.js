public class IndividualQuestionsTable {
  private var _report;
  private var _table;
  private var _variableId;
  private var _question;
  private var _metaData;
  private var _log;
  
  function IndividualQuestionsTable(report, table, variableId, metaData, log) {
    _report = report;
    _table = table;
    _variableId = variableId;
    _metaData = metaData;
    _question = GetQuestion(variableId);
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
    var headerQuestionProperties = GetHeaderQuestionProperties();
    var rowExpression = _variableId + '{' + headerQuestionProperties + '}';
    return rowExpression;
  }
      
  private function GetHeaderQuestionProperties() {
    var headerQuestionProperties = [];
    headerQuestionProperties.push ("totals:true");
    switch (_question.QuestionType) {
      case QuestionType.Multi:
        headerQuestionProperties.push("collapsed:true");
        break;
      default:
        headerQuestionProperties.push("collapsed:false");
        break;
    }
    if(QuestionProperties.HasScores(_question)) {
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
}