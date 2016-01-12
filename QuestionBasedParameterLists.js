class QuestionBasedParameterLists
{
  static function GetParameterValues(parameterName, report, log)
  { 
    var metaData = new MetaData(report, log);
    switch (parameterName.toUpperCase()) {  
      case "CROSSTAB":
        var questions = metaData.GetQuestions(Config.DS_Main, true);
        return GetCrosstabVariables(questions, log);
      case "METRIC":
      case "POSITIONING_METRIC_1":
      case "POSITIONING_METRIC_2":
        var questions = metaData.GetQuestions(Config.DS_Main, true);
        return GetMetricVariables(questions, log);
      case 'ONE_QUESTION':
      case 'QUESTION':
      case 'QUESTIONS':
        var questions = metaData.GetQuestions(Config.DS_Main, true);
        return GetQuestionList(questions, log);
      case "POSITIONING_DEMOGRAPHIC":
      case "VERBATIM_DEMOGRAPHICS":
        //var demographicQuestions = metaData.GetQuestionsByCategory(Config.DS_Main, "demo", true);
        var projectv1 : Project = report.DataSource.GetProject(Config.DS_Main);
        var demographicQuestions = projectv1.GetQuestionsWithAnswers(false, ["demo"]);
        return GetDemographicVariables(demographicQuestions, log);
      case "SEGMENT":
        var questions = metaData.GetQuestions(Config.DS_Main, true);
		return GetSegmentVariables(questions, true); 
      case 'SCORECARD_NESTING':
        //var demographicQuestions = metaData.GetQuestionsByCategory(Config.DS_Main, "demo", true);
        var projectv2 : Project = report.DataSource.GetProject(Config.DS_Main);
        var demographicQuestions = projectv2.GetQuestionsWithAnswers(false, ["demo"]);
        return GetNestingVariables(demographicQuestions, log);
      case "VERBATIM":
        var varbatimQuestions = metaData.GetQuestionsByCategory(Config.DS_Main, "verbatim", true);
        return GetVerbatimVariables(varbatimQuestions, log);
    }   
  }
  
  private static function GetCrosstabVariables(questions, log) {
    var parameterValues = [];
    for(var i = 0; i < questions.length; i++) {
      var question = questions[i];     
      switch(question.QuestionType) {
        case QuestionType.Single:
        case QuestionType.Multi: 
          parameterValues.push(CreateSimpleParameterValue(question));
          break;
        case QuestionType.Grid:
          var answers = question.Answers;
          for(var j = 0; j < answers.length; j++) {
            parameterValues.push(CreateGridParameterValue(question, answers[j]));
          }
          break;
      }
	}    
    return parameterValues;
  }
  
  private static function GetMetricVariables(questions, log) {
    var parameterValues = [];     
    for(var i = 0; i < questions.length; i++) {
      var question = questions[i];      
      switch(question.QuestionType) {
        case QuestionType.Single:
          if(QuestionProperties.HasScores(question)) {
            parameterValues.push(CreateSimpleParameterValue(question));
          }
          break;
        case QuestionType.Grid:
          if(QuestionProperties.HasScores(question)) {
            var answers = question.Answers;
            for(var j = 0; j < answers.length; j++) {
              parameterValues.push(CreateGridParameterValue(question, answers[j]));
            }
          }
          break;
  	  }
	}
    return parameterValues;
  }
  
  private static function GetQuestionList(questions, log) {
    var parameterValues = [];
    for(var i = 0; i < questions.length; i++) {
      var question = questions[i];     
      switch(question.QuestionType) {
        case QuestionType.Single:
        case QuestionType.Multi: 
          parameterValues.push(CreateSimpleParameterValue(question));
          break;
        case QuestionType.Grid:
          var answers = question.Answers;
          for(var j = 0; j < answers.length; j++) {
            parameterValues.push(CreateGridParameterValue(question, answers[j]));
          }
          break;
      }
	}    
    return parameterValues;    
  }
  
  private static function GetDemographicVariables(demographicQuestons, log) {
    var parameterValues = [];
    for (var i = 0; i < demographicQuestons.length; ++i) {
      var question = demographicQuestons[i];
      parameterValues.push({
          Label: question.Title,
          Code: question.QuestionId
        }
      );
    }
    return parameterValues;
  }
  
  private static function GetSegmentVariables(questions, hideText) {
    var parameterValues = [];
    for(var i = 0; i < questions.length; i++) {
      var question = questions[i];
      var label = hideText ? (question.Title + ' [' + question.QuestionId + ']') : ([question.Title, question.Text].join(' - '));
      switch(question.QuestionType) {
        case QuestionType.Single:
          parameterValues.push(CreateSimpleParameterValue(question));
          break;
      }
	}    
    return parameterValues;
  }
  
  private static function GetNestingVariables(nestingQuestions, log) {
    var parameterValues = [];
    for(var i = 0; i < nestingQuestions.length; i++) {
      var question = nestingQuestions[i];
      switch(question.QuestionType) {
          case QuestionType.Single:
          case QuestionType.Multi:  
            parameterValues.push(CreateSimpleParameterValue(question));
            break;
          case QuestionType.Grid:
            var answers = question.Answers;
            for(var j = 0; j < answers.length; j++) {
              parameterValues.push(CreateGridParameterValue(question, answers[j]));
            }
            break;
        }
    }
    return parameterValues;
  }
  
  private static function GetVerbatimVariables(varbatimQuestions, log) {
    var parameterValues = [];      
    for(var i = 0; i < varbatimQuestions.length; i++) {
      var question = varbatimQuestions[i];   
      switch(question.QuestionType) {
        case QuestionType.OpenText: 
          parameterValues.push(CreateSimpleParameterValue(question));
          break;
      }   	 
  	}
    return parameterValues;
  }
  
  static function AnswersToParamValues(report, questionId, label) {
	var answerParameterValues = [];
    var project = report.DataSource.GetProject(Config.DS_Main);
    var question = project.GetQuestion(questionId);
    if (label == null) {
      label = question.Title;
    }
    var answers = question.GetAnswers();
    for (var i = 0; i < answers.length; ++i) {
      answerParameterValues.push({
          Label: answers[i].Text,
          Code: answers[i].Precode
        }
      );
    }
    return answerParameterValues;
  }

  static function CreateSimpleParameterValue(question) {
    var labels = [];
    labels.push(question.QuestionId);
    if(question.Title != null && question.Title.Trim() != "") {
      labels.push(question.Title);
    }
    return {
             Code: question.QuestionId, 
             Label: TextUtilities.CleanText(labels.join(" > ")),
             Question: question
           };
  }
  
  static function CreateGridParameterValue(question, answer) {
    var questionTexts = [];
    if(question.Title != null && question.Title.Trim() != "") {
      questionTexts.push(question.Title);
    }
    if(answer.Text != null && answer.Text.Trim() != "") {
      questionTexts.push(answer.Text);
    }
    var labels = [];
    labels.push(question.QuestionId);
    if(questionTexts.length > 0) {
      labels.push(questionTexts.join(' - '));
    }
    return {
             Code: question.QuestionId + "." + answer.Code, 
             Label: TextUtilities.CleanText(labels.join(" > ")),
			 Question: question
           };
  }
}