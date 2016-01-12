class FilterParameterLists {
  static function GetFilterOptions(report, index, log) {
    var filters = ReportMetaData.GetFilterQuestions(report, Config.DS_Main, log);
    if(index <= filters.length) {
      var answerParameterValues = [];
      for (var i = 0; i < filters[index-1].Answers.length; ++i) {
        answerParameterValues.push({
            Label: filters[index-1].Answers[i].Text,
            Code: filters[index-1].Answers[i].Code
          }
        );
      }
      return answerParameterValues;
    }
    return null;
  }
}