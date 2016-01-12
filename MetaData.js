class MetaData {
  private static var surveys = {};
  private var _report;
  private var _log;
  
  function MetaData(report, log) {
    _report = report;
    _log = log;
  } 
  
  function GetQuestions(datasourceId : String, includeAnswers : boolean) {
    var project : Project = _report.DataSource.GetProject(datasourceId);
    var cacheKey = [datasourceId, project.ProjectId, _report.CurrentLanguage].join('_');
    if(surveys[cacheKey] == null) {
      var start = DateTime.Now;
      var questions = project.GetQuestions({NotInCategories: ["exclude"], WithAnswers: true});
      var nonExcludedQuestions = CreateLocalQuestionList(questions);
      surveys[cacheKey] = {Questions:nonExcludedQuestions, Timestamp: DateTime.Now};
    }
    return surveys[cacheKey].Questions;
  }
  
  function CreateLocalQuestionList(questions) {
    var localQuestions = [];   
    var questionsAtEndOfList = [];
    for(var i = 0; i < questions.length; i++) { 
      var localQuestion = CreateLocalQuestion(questions[i]);
      if(ArrayUtilities.ArrayContains(Config.VariablesToPutAtEndOfList, localQuestion.QuestionId)) {
        questionsAtEndOfList.push(localQuestion);
      }
      else {
        localQuestions.push(localQuestion); 
      }
    }
    return localQuestions.concat(questionsAtEndOfList);
  }
  
  private function CreateLocalQuestion(question) {
    var localQuestion = {Text: question.Text, 
                         Title: question.Title, 
                         QuestionId: question.QuestionId,
                         QuestionType: question.QuestionType,
                         Categories: question.GetCategories()};
    switch(question.QuestionType) {
      case QuestionType.Grid:
      case QuestionType.Multi:
      case QuestionType.MultiNumeric:
      case QuestionType.MultiOpen:
      case QuestionType.MultiOrdered:
      case QuestionType.Single:
        localQuestion.AnswerCount = question.AnswerCount;
        if(localQuestion.AnswerCount <= 1000) {
          localQuestion.Answers = CreateAnswerList(question.GetAnswers());
        }
        else {
          localQuestion.Answers = [];
        }
        break;
    }
    if(question.HasScale) {
      localQuestion.Scale = CreateAnswerList(question.GetScale());
    }
    return localQuestion;
  }
 
  function GetCategoryNames (report, datasourceId, log) {   
    var categories = [];
    var questions = GetQuestions(report, datasourceId, false, log);
    for (var i = 0; i < questions.length; ++i) {  
      var cats = questions[i].Categories;
      for (var j = 0; j < cats.length; ++j) {
        var category_name = cats[j];
        var found = false;
        for (var k = 0; k < categories.length; ++k) {
          if (categories[k] == category_name) found = true;
        }
        if (!found) {
          categories.push(category_name);
        }
      }
    }
    return categories;
  }
  
  function GetQuestionsByType(datasourceId, questionType, includeAnswers) {
    var questionsInType = [];    
    var questions = GetQuestions(datasourceId, includeAnswers);    
    for(var i = 0; i < questions.length; i++) {
      var question = questions[i];
      if(question.QuestionType == questionType) {
      	questionsInType.push(question);
      }
    }    
    return questionsInType;
  }
  
  function GetQuestionsByTypeArray(datasourceId, questionTypes, includeAnswers) {
    var questionsInType = [];    
    var questions = GetQuestions(datasourceId, includeAnswers);     
    for(var i = 0; i < questions.length; i++) {
      var question = questions[i]; 
      for(var j = 0; j < questionTypes.length; j++) {
        if(question.QuestionType == questionTypes[j]) {
      	  questionsInType.push(question);
        }
      }
    } 
    return questionsInType;
  }
   
  function GetQuestion(datasourceId : String, questionId : String, includeAnswers : boolean) {
    var questions = GetQuestions(datasourceId, includeAnswers);
    questionId = questionId.toUpperCase();
    for (var i = 0; i < questions.length; ++i) {
      if (questions[i].QuestionId.toUpperCase() == questionId) {
        return questions[i];
      }
    }
  }
   
  function GetQuestionsByCategory(datasourceId, category, includeAnswers) {
    var questionsInCategory = [];    
    var questions = GetQuestions(datasourceId, includeAnswers);
    for(var i = 0; i < questions.length; i++) {
      var question = questions[i];
      if(QuestionProperties.IsInCategory(question, category)) {
      	questionsInCategory.push(question);
      }
    } 
    return questionsInCategory;
  }
  
  /*function GetAnswers(report, datasourceId, question) {
    var project : Project = report.DataSource.GetProject(datasourceId);
    var reportalQuestion : Question = project.GetQuestion(question.QuestionId);
    if(reportalQuestion.AnswerCount <= 1000) {
      return CreateAnswerList(reportalQuestion.GetAnswers());
    }
    return [];
  }*/

  private function CreateAnswerList(answerList) {
    var answers = [];    
    for(var i = 0; i < answerList.length; i++) {
      var reportalAnswer = answerList[i];
      var answer = {Code: reportalAnswer.Precode,
                    Text: reportalAnswer.Text,
                    Score: reportalAnswer.Weight};
      answers.push(answer);
    }  
    return answers;
  }
}