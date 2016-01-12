class QuestionProperties {
  static function IsInCategory(question, category) {
    category = category.toUpperCase();
    for(var i = 0; i < question.Categories.length; i++) {
      if(question.Categories[i].toUpperCase() == category) {
        return true;
      }
    }
    return false;    
  }

  static function GetAnswer(question, code) {
    for(var i = 0; i < question.Answers.length; i++) {
      var answer = question.Answers[i];              
      if(answer.Code == code) {
        return answer;
      }
    }    
    return null;
  }
  
  static function HasScores(question) {
    switch (question.QuestionType) {  
      case QuestionType.Grid:
        return AnswerListHasScores(question.Scale);
        break;   
      case QuestionType.Single:
      case QuestionType.Multi:
        return AnswerListHasScores(question.Answers);
        break;
    }
  }
  
  private static function AnswerListHasScores(answers) {
    for(var i = 0; i < answers.length; i++)
      if(answers[i].Score != null) {
        return true;
      }
    return false;
  }
  
  static function MaxAndMinScores(question) {
    if(HasScores(question)) {
      switch (question.QuestionType) {  
        case QuestionType.Grid:
          return AnswerListMaxAndMinScores(question.Scale);
          break;   
        case QuestionType.Single:
        case QuestionType.Multi:
          return AnswerListMaxAndMinScores(question.Answers);
          break;
      }
    }
  }
  
  
  private static function AnswerListMaxAndMinScores(answers) {
    var max = answers[0].Score;
    var min = answers[0].Score
    for(var i = 1; i < answers.length; i++) {
      if(answers[i].Score != null) {
        if(answers[i].Score > max) {
          max = answers[i].Score
        }
        if(answers[i].Score < min) {
          min = answers[i].Score
        }
      }
    }
    return {Max: max, Min: min};
  }
  
  static function IsNPSQuestion(question) {
    var scoredItems = GetScoredItems(question);
    if(scoredItems.length == 10) {
      var npsScaleDetails = {
        ScaleLength: 10,
        IsNPSScale: true,
        DetractorCodes: [],
        PromotorCodes: []
      }
      for(var i = 0; i < scoredItems.length; i++) {
        if(scoredItems[i].Score != i+1) {
          npsScaleDetails.IsNPSScale = false;
          break;
        }
        else {
          if(scoredItems[i].Score >= 0 && scoredItems[i].Score <= 6) {
            npsScaleDetails.DetractorCodes.push(scoredItems[i].Code);
          }
          else if(scoredItems[i].Score >= 9 && scoredItems[i].Score <= 10) {
            npsScaleDetails.PromotorCodes.push(scoredItems[i].Code);
          }
        }
      }
      return npsScaleDetails;
    }
    else if(scoredItems.length == 11) {
      var npsScaleDetails = {
        ScaleLength: 11,
        IsNPSScale: true,
        DetractorCodes: [],
        PromotorCodes: []
      }
      for(var i = 0; i < scoredItems.length; i++) {
        if(scoredItems[i].Score != i) {
          npsScaleDetails.IsNPSScale = false;
          break;
        }
        else {
          if(scoredItems[i].Score >= 0 && scoredItems[i].Score <= 6) {
            npsScaleDetails.DetractorCodes.push(scoredItems[i].Code);
          }
          else if(scoredItems[i].Score >= 9 && scoredItems[i].Score <= 10) {
            npsScaleDetails.PromotorCodes.push(scoredItems[i].Code);
          }
        }
      }
      return npsScaleDetails;
    }
    return {IsNPSScale: false};
  }
  
  static function GetSortedScoredItems() {
    
  }
  
  private function GetSortedScoredScales(question) {
    var scoredScales = GetScoredItems(question);
    return scoredScales.sort(Sorting.ByScoreAscending);
  }
  
  static function GetScoredItems(question) {
    var items;
    if(question.QuestionType == QuestionType.Grid) {
      items = question.Scale;
    }
    else {
      items = question.Answers;
    }
    var scoredItems = [];
    for(var i = 0; i < items.length; ++i) {
      if(items[i].Score != null) {
        scoredItems.push(items[i]);
      }
    }
    return scoredItems;
  }
}