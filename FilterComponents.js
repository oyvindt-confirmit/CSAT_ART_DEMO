class FilterComponents { 
  private const GlobalDateFilterStart = "GLOBALDATEFILTERSTART";
  private const GlobalDateFilterEnd = "GLOBALDATEFILTEREND";
  
  private var _report;
  private var _log;
  private var _filterQuestions;
  private var _parameterUtilities;
  
  function FilterComponents(report, parameterUtilities, log) {
    _report = report;
    _log = log;
    _parameterUtilities = parameterUtilities;
    _filterQuestions = ReportMetaData.GetFilterQuestions(report, Config.DS_Main);   
  }
  
  function SetFilterParameters(page) {
    if(page.SubmitSource == "SaveReturn" || page.SubmitSource == "Save") {
      var filterExpression = GetGlobalFilterExpression();
      var filterSummary = GetFilterText();
      _parameterUtilities.SaveValueResponse("FILTERS_SELECTED_EXPRESSION", filterExpression);
      _parameterUtilities.SaveValueResponse("FILTERS_SELECTED_SUMMARY", filterSummary);     
    }
  }
  
  function RedirectToLastPage(page) {
    var parameterName = "LASTPAGE_ID";
    if (page.SubmitSource == "SaveReturn") {
      var lastPageId = _parameterUtilities.GetParameterString(parameterName);
      if(lastPageId != null) {
        page.NextPageId = lastPageId;
      }
    }
  }
  
  function HideFilter(filterNumber) {
    return (filterNumber > _filterQuestions.length);
  }
  
  function FilterHeading(filterNumber) {
    if (filterNumber <= _filterQuestions.length) {
      var question = _filterQuestions[filterNumber-1];
      return question.Title;
    }
    return '';
  }   
  
  private function GetGlobalFilterExpression() {
    var filterSegments = [];
    var dateFilters = GetGlobalDateFilterExpression();
    if(dateFilters.length > 0) {
      filterSegments = filterSegments.concat(dateFilters);
    }
    var parameterFilter = GetParamFilterExpression();
    if(parameterFilter != null) {
      filterSegments.push(parameterFilter);
    }
    return filterSegments.join(' AND ');
  }
  
  private function GetGlobalDateFilterExpression() {
    var filterExpressionSegments = [];
    var startDate = _parameterUtilities.GetParameterDate(GlobalDateFilterStart);
    if(startDate != null) {
      filterExpressionSegments.push(Config.DateVariableId + " >= TODATE(\"" + CreateShortDate(startDate) + "\")");
    }
    var endDate = _parameterUtilities.GetParameterDate(GlobalDateFilterEnd);
    if(endDate != null) {
      filterExpressionSegments.push(Config.DateVariableId + " <= TODATE(\"" + CreateShortDate(endDate) + "\")");
    }
    if(filterExpressionSegments.length > 0) {
      return filterExpressionSegments;
    }
    return [];
  }
  
  private static function CreateShortDate(date) {
    var shortDateSegments = [];
    shortDateSegments.push(date.Year);
    if(date.Month < 10) {
      shortDateSegments.push("0" + date.Month);
    }
    else {
      shortDateSegments.push(date.Month);
    }
    if(date.Day < 10) {
      shortDateSegments.push("0" + date.Day);
    }
    else {
      shortDateSegments.push(date.Day);
    }
    return shortDateSegments.join("-");    
  }
  
  private function GetParamFilterExpression() {
    var filterExpressionSegments = [];
    for (var i = 0; i < _filterQuestions.length; ++i) {
      var codes = GetFilterCodes(i);
      if(codes != null && codes.length > 0) {
        if(_filterQuestions[i].QuestionType == QuestionType.Multi) {
          filterExpressionSegments.push ('ANY(' + _filterQuestions[i].QuestionId + ',' + codes.join(',') + ')');
        }
        else {
          filterExpressionSegments.push ('IN(' + _filterQuestions[i].QuestionId + ',' + codes.join(',') + ')');
        }
      }
    }
    if(filterExpressionSegments.length > 0) {
      return filterExpressionSegments.join(' AND ');
    }
    return null;
  }
  
  private function GetFilterCodes(filterNumber) {
    var parameterName = 'FILTER' + (filterNumber + 1);
    var codes = _parameterUtilities.GetParameterCodes(parameterName);
    if(codes != null) {
      for (var i = 0; i < codes.length; ++i) {
        codes[i] = '"' + codes[i] + '"';
      }
      return codes;
    }
    else {
      return null;
    }
  }
  
  private function GetFilterText() {
    var filterTexts = [];
    filterTexts = filterTexts.concat(GetDateFilterText());
    var parameterFilterText = GetParamFilterText();
    if(parameterFilterText != null) {
      filterTexts.push(parameterFilterText);
    }
    if(filterTexts.length > 0) {
      var filterSummary = filterTexts.join('<span class=SelectorHeading> AND </span>');
      filterSummary += " <button class='btn btn-xs btn-cancel-filter' onclick='clickClearFiltersButton()'><span class='badge'>x</span></button>";
      return filterSummary;
    }
    return "";
  }
                                   
  private function GetDateFilterText() {
    var filterExpressionTexts = [];
    var startDate = _parameterUtilities.GetParameterDate(GlobalDateFilterStart);
    if(startDate != null) {
      filterExpressionTexts.push('<div class="well-filter-summary well-filter-summary-xs">' + Config.DateVariableId + " >= " + CreateShortDate(startDate) + '</div>');
    }
    var endDate = _parameterUtilities.GetParameterDate(GlobalDateFilterEnd);
    if(endDate != null) {
      filterExpressionTexts.push('<div class="well-filter-summary well-filter-summary-xs">' + Config.DateVariableId + " <= " + CreateShortDate(endDate) + '</div>');
    }
    if(filterExpressionTexts.length > 0) {
      return filterExpressionTexts;//'<div class="well-filter-summary well-filter-summary-xs">' + filterExpressionTexts.join(" AND ") + '</div>';
    }
    return [];
  }
  
  private function GetParamFilterText()
  {
    var filterText = [];
    for(var i = 0; i < _filterQuestions.length; ++i) {
      var parameterName = 'FILTER' + (i + 1);
      var selectedFilterCodes = _parameterUtilities.GetParameterCodes(parameterName);
      if(selectedFilterCodes != null && selectedFilterCodes.length > 0) {
        var filterTextSegment = CreateFilterTextSegment(_filterQuestions[i], selectedFilterCodes);
        filterText.push(filterTextSegment);
      }
    }
    if (filterText.length > 0) {
      return filterText.join('<span class=SelectorHeading> AND </span>');
    }
    return null;
  }
  
  private function CreateFilterTextSegment(filterQuestion, codes) {
    var label = filterQuestion.Title;
    var labels = [];
    for (var j = 0; j < codes.length; ++j) {
      var code = codes[j];
      var answer = QuestionProperties.GetAnswer(filterQuestion, code)
      labels.push(answer.Text);
    }
    return '<div class="well-filter-summary well-filter-summary-xs">' + label.toUpperCase() + ' = ' + labels.join (' | ') + '</div>';
  }
}