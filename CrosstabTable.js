class CrosstabTable {
  private var _report;
  private var _log;
  private var _tableOptions;
  private var _selectedRowQuestions;
  private var _recodings;
  private var _table;
  private var _sortedRowQuestionHeaders;
  private var _banner;
  private var _parameterUtilities;
  private var _metaData;
  private var _timeUtilities;
  
  function CrosstabTable(report, table, parameterUtilities, metaData, timeUtilities, log) {
    _report = report;
    _table = table;
    _parameterUtilities = parameterUtilities;
    _metaData = metaData;
    _timeUtilities = timeUtilities;
    _log = log; 
    _tableOptions = CreateTableOptions();
    _selectedRowQuestions = parameterUtilities.GetParameterCodes('QUESTION');
    _recodings = SetRecodings();
    _sortedRowQuestionHeaders = [];
    _banner = SetBanner();
  }
    
  private function CreateTableOptions() {
    var tableOptions = {
      Base: _parameterUtilities.Selected('BASE'),
      Decimals: _parameterUtilities.Selected('DECIMALS').Decimals,
      Totals: _parameterUtilities.Selected('TOTALS').Totals,
      Statistics: _parameterUtilities.Selected('STATS').Statistics,
      SigTesting: _parameterUtilities.Selected('SIGTEST'),
      Trend: _parameterUtilities.Selected('CROSSTAB_TRENDING'),
      IndividualScores: _parameterUtilities.GetParameterCode('CROSSTAB_INDIVIDUAL_SCORES')
    }
    return tableOptions;
  }
  
  private function SetRecodings() {
    var recodings = _parameterUtilities.GetParameterString("recodings", null);
    if(recodings != null) {
      return eval(recodings);
    }
    return null;
  }
  
  private function SetBanner() {
    var banner = _parameterUtilities.GetParameterString("Banners", null);
    if(banner !== null && banner !== "" && banner !== "null") {
      return eval(banner)[0];
    }
    return null;
  }
  
  function CreateTableExpression() {
    var tableRowsExpression = CreateRowsExpression();
    var tableColumnsExpression = CreateColumnsExpression(_tableOptions.Trend);
    var tableExpression = [tableRowsExpression, tableColumnsExpression].join('^');
    return tableExpression;
  }
  
  private function CreateRowsExpression() {
    var headerIdentifier = 0;
    var rowExpressions = [];
    for (var i = 0; i < _selectedRowQuestions.length; ++i) {
      var selectedQuestion = _selectedRowQuestions[i].split(".")[0];
      rowExpressions.push(CreateRowQuestionExpression(_selectedRowQuestions[i]));
      var questionMetaData = _metaData.GetQuestion(Config.DS_Main, selectedQuestion, true);
      if(QuestionProperties.IsInCategory(questionMetaData, "sort")) {
        _sortedRowQuestionHeaders.push({headerNumber:headerIdentifier, question: questionMetaData});
      }
      headerIdentifier++;    
	}
	return rowExpressions.join('+');
  }
  
  private function CreateRowQuestionExpression(selectedQuestion)
  {
    var questionId = selectedQuestion.split('.')[0];
    var question = _metaData.GetQuestion(Config.DS_Main, questionId, true);
    var rowQuestionIdentifier;
    if(question.QuestionType == QuestionType.Grid) {
      rowQuestionIdentifier = selectedQuestion;
    }
    else {
      rowQuestionIdentifier = selectedQuestion.split('.')[0]
    }	
    var questionHeaderProperties = [];
    questionHeaderProperties.push ('title:true');
	questionHeaderProperties.push ('totals:' + _tableOptions.Totals);
    questionHeaderProperties.push(CollapseQuestion(question));
    if(_tableOptions.Statistics && QuestionProperties.HasScores(question)) {
      questionHeaderProperties.push("statistics:avg,stdev");
    }
    if(_tableOptions.IndividualScores == "2") {
      questionHeaderProperties.push(MaskOutAllAnswers(question));
    }
	return rowQuestionIdentifier + '{' + questionHeaderProperties.join(';') + '}';
  }
  
  private function MaskOutAllAnswers(question) {
    var maskCodes = [];
    var answers;
    if(question.QuestionType === QuestionType.Grid) {
      answers = question.Scale;
    }
    else {
      answers = question.Answers;
    }
    for(var i = 0; i < answers.length; ++i) {
      maskCodes.push(answers[i].Code);
    }
    return "xmask:" + maskCodes.join(",");
  }
  
  private function CollapseQuestion(question) {
    switch (question.QuestionType) {
	  case QuestionType.Multi:
	    return "collapsed: true";
	  default:
	    return "collapsed: false";
    } 
  }

  private function CreateColumnsExpression(trend) {
    var columnHeaders = [];
    var trendHeaderExpression = CreateTrendHeaderExpression();
    var baseHeaderExpression = CreateBaseHeaderExpression();

    if (_tableOptions.Totals) {
      columnHeaders.push(CreateTotalsColumnHeader());
    }

    if(_banner != null) {
      var columnHeaderExpression = "";
      if(_banner.Operation == "SideBySide") {
        columnHeaderExpression = CreateSideBySideColumnExpression(trendHeaderExpression, baseHeaderExpression);
      }
      else {
        columnHeaderExpression = CreateNestedColumnExpression(trendHeaderExpression, baseHeaderExpression);
      }
      columnHeaders.push(columnHeaderExpression);
    }
    else if(trendHeaderExpression != null) {
      var columnHeaderExpression = [];
      columnHeaderExpression.push(trendHeaderExpression);
      if(baseHeaderExpression != null) {
        columnHeaderExpression.push(baseHeaderExpression);
      }
      columnHeaders.push(columnHeaderExpression.join('/'));
    }
    return columnHeaders.join('+');
  }
  
  private function CreateTrendHeaderExpression() {
    var trendHeaderExpression = null;
    if(_tableOptions.Trend.Code != "ALL") {
      if(_tableOptions.Trend.Code == "0") {
        trendHeaderExpression = _timeUtilities.GetCustomPeriods(Config.DateVariableId);
      }
      else {
        trendHeaderExpression = Config.DateVariableId + "{id:dt; totals:false}";
      }
    }
    return trendHeaderExpression;
  }
  
  private function CreateBaseHeaderExpression() {
    var baseOn = _tableOptions.Base.N;
    if (baseOn) {
      var expression = "CELLVALUE(col-1,row)";
      return "(" + "[N]{hidedata:true}+[FORMULA]{label:\"n\";decimals:0;expression:\"" + expression + "\"}+[SEGMENT]{label:\"Pct\"}" + ")";
    }
    return null;
  }
  
  private function CreateTotalsColumnHeader() {
    var totalsExpression = [];
	if (_tableOptions.Trending) {
      var time_expression = _timeUtilities.TimeseriesExpression(Config.DateVariableId).Expression;
      totalsExpression.push('(' + time_expression + ')');
    }
    if(_tableOptions.Base.Code == "1") {   
      var expression = "CELLVALUE(col-1,row)";
      var baseAndPctExpression = [
		'[N]{hidedata:true}',
        "[FORMULA]{label:\"n\";decimals:0;expression:\"" + expression + "\";hidedata:" + !_tableOptions.Base + "}",
		'[SEGMENT]{hideheader:true; label:"Pct"}'
	  ].join('+');
      totalsExpression.push("(" + baseAndPctExpression + ")");
	  return '[SEGMENT]{label:"Total"}' + '/' + '(' + totalsExpression.join("/") + ')'; 
    }
    return '[SEGMENT]{label:"Total"}'
  }
  
  private function CreateSideBySideColumnExpression(trendHeaderExpression, baseHeaderExpression) {
    var columnHeaders = [];
    for(var i = 0; i < _banner.Variables.length; i++) {
      var variable = _banner.Variables[i];
      var columnHeader;
      if(variable.QuestionId.StartsWith("_")) { //Is a recoding
        columnHeader = CreateSideBySideRecodingExpression(variable, trendHeaderExpression, baseHeaderExpression);
      }
      else {
        columnHeader = CreateSideBySideColumnQuestionExpression(variable, trendHeaderExpression, baseHeaderExpression);
      }
      columnHeaders.push("(" + columnHeader + ")");
    }
    return "(" + columnHeaders.join("+") + ")";
  }
  
  private function CreateSideBySideRecodingExpression(variable, trendHeaderExpression, baseHeaderExpression) {
  	var recodingId = variable.QuestionId.substr(1);
    var recoding;
    for(var i = 0; i < _recodings.length; i++) {
      if(_recodings[i].Id == recodingId) {
        recoding = _recodings[i];
        break;
      }
    }
    var recodingExpressions = CreateRecodedAnswersSegmentExpression(recoding, variable, null);
    var encodedName = _report.TableUtils.EncodeJsString(recoding.Name);
    var expression = "[SEGMENT]{label:" + encodedName + "}/(" + recodingExpressions + ")";
    if(trendHeaderExpression != null) {
      expression += "/" + trendHeaderExpression;
    }
    if(baseHeaderExpression != null) {
      expression += "/" + baseHeaderExpression;
    }
    return expression;
  }
  
  private function CreateSideBySideColumnQuestionExpression(variable, trendHeaderExpression, baseHeaderExpression) {
    var properties = [];
    if(variable.Option != "ShowAll") {
      if(variable.Option == "Include") {
        properties.push("MASK:" + variable.Codes);
      }
      else {
        properties.push("XMASK:" + variable.Codes);
      }
    }
    properties.push("totals:false;title:true");
    var expression = variable.QuestionId + '{' + properties.join(';') + '}';
    if(trendHeaderExpression != null) {
      expression += "/" + trendHeaderExpression;
    }
    if(baseHeaderExpression != null) {
      expression += "/" + baseHeaderExpression;
    }
    return expression;
  }
  
  private function CreateNestedColumnExpression(trendHeaderExpression, baseHeaderExpression) {
    var baseExpression = [];
    if(trendHeaderExpression != null) {
      baseExpression.push(trendHeaderExpression);
    }
    if(baseHeaderExpression != null) {
      baseExpression.push(baseHeaderExpression);
    }
    var expression = baseExpression.join("/");
    for(var j = _banner.Variables.length - 1; j >= 0; j--) {
      var variable = _banner.Variables[j];
      var columnHeader;
      if(variable.QuestionId.StartsWith("_")) {  //Is a recoding
        expression = CreateNestingRecodingExpression(variable, expression);
      }
      else {
        if(expression != null && expression != "") {
          expression = CreateColumnQuestionExpression(variable) + "/" + expression;
        }
        else {
          expression = CreateColumnQuestionExpression(variable);
        }
      }
    }
    return expression;
  }
  
  private function CreateNestingRecodingExpression(variable, expression) {
    var columnHeaders = [];
    var recodingId = variable.QuestionId.substr(1);
    var recoding;
    for(var i = 0; i < _recodings.length; i++) {
      if(_recodings[i].Id == recodingId) {
        recoding = _recodings[i];
        break;
      }
    }    
    var recodingExpressions = CreateRecodedAnswersSegmentExpression(recoding, variable, expression);
    var encodedName = _report.TableUtils.EncodeJsString(recoding.Name);
    expression = "[SEGMENT]{label:" + encodedName + "}/(" + recodingExpressions + ")";
    return expression;
  }

  private function CreateRecodedAnswersSegmentExpression(recoding, variable, existingExpression) {
    var maskedRecodedAnswers = GetMaskedRecodedAnswers(variable, recoding);
    var recodingExpressions = [];
    for(var i = 0; i < maskedRecodedAnswers.length; i++) {
      var recodedAnswers = maskedRecodedAnswers[i];
      var expression = 'IN(' + recoding.BaseQuestion + ', "' + recodedAnswers.Codes.join('","') + '")';
      expression = _report.TableUtils.EncodeJsString(expression);
      var answerLabel = _report.TableUtils.EncodeJsString(recodedAnswers.Name);
      if(existingExpression != null && existingExpression != "") {
        recodingExpressions.push('([SEGMENT]{label:' + answerLabel + ';' + 'expression:' + expression + '}/' + existingExpression + ")");
      }
      else {
        recodingExpressions.push('[SEGMENT]{label:' + answerLabel + ';' + 'expression:' + expression + '}');
      }
    }
    return recodingExpressions.join('+');
  }
  
  private function GetMaskedRecodedAnswers(variable, recoding) {
    var maskedRecodedAnswers = [];
    if(variable.Option != "ShowAll") {
    	for(var j = 0; j < recoding.RecodedAnswers.length; j++)	{
    		if(variable.Option == "Include") {
              for(var k = 0; k < variable.Codes.length; k++) {
                if(variable.Codes[k] == recoding.RecodedAnswers[j].Id) {
                  maskedRecodedAnswers.push(recoding.RecodedAnswers[j]);
                }
              }
    		}
    		else {
              var contains = false;
              for(var k = 0; k < variable.Codes.length; k++) {
                if(variable.Codes[k] == recoding.RecodedAnswers[j].Id) {
                  contains = true;
                }
              }
    		  if(!contains) {
    			maskedRecodedAnswers.push(recoding.RecodedAnswers[j]);
              }
    		}
    	}
    }
    else {
      maskedRecodedAnswers = recoding.RecodedAnswers;
    }
    return maskedRecodedAnswers;
  }
  
  private function CreateColumnQuestionExpression(variable) {
    var properties = [];
    if(variable.Option != "ShowAll") {
      if(variable.Option == "Include") {
        properties.push("MASK:" + variable.Codes);
      }
      else {
        properties.push("XMASK:" + variable.Codes);     
      }
    }
    properties.push("totals:false;title:true");
    return variable.QuestionId + '{' + properties.join(';') + '}';
  }
   
  function ApplySorting() {
    if(_sortedRowQuestionHeaders.length > 0) {
      for(var i = 0; i < _sortedRowQuestionHeaders.length; i++) {
        TableUtil.ApplySorting(_table, _sortedRowQuestionHeaders[i].question, _sortedRowQuestionHeaders[i].headerNumber, 2);
      }
    }
  }
  
  function ReplaceTrendHeader() {
    if(_tableOptions.Trend.Code != "ALL" && _tableOptions.Trend.Code != "0") {
      var interval = _parameterUtilities.GetParameterCode('TRENDING_INTERVAL');
      var trendingHeaderQuestion = _timeUtilities.CreateTrendHeader(_tableOptions.Trend, interval); 
      TableUtil.ReplaceColumnHeadersById(_table, "dt", trendingHeaderQuestion, _log);
    }
  }

  function CreateSignificanceTestSettings() {
    var significanceTestSettings : SignificanceTestSettings = new SignificanceTestSettings();
    significanceTestSettings.SignificanceTesting = _tableOptions.SigTesting.Enabled;
    if(_tableOptions.SigTesting.Enabled) {
      if(_tableOptions.SigTesting.Type != null) {
        significanceTestSettings.TestType = _tableOptions.SigTesting.Type;
      }
      if(_tableOptions.SigTesting.ConfidenceLevel != null) {
        significanceTestSettings.ConfidenceLevel = _tableOptions.SigTesting.ConfidenceLevel;
      }
    }
    return significanceTestSettings;
  }
  
  function GetTableDecimals() {
    return _tableOptions.Decimals;
  }
  
  function GetNumberOfSortedRowHeaders() {
    return _sortedRowQuestionHeaders.length;
  }
}