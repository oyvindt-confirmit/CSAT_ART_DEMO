class FilterPage { 
  private const GlobalDateFilterStart = "GLOBALDATEFILTERSTART";
  private const GlobalDateFilterEnd = "GLOBALDATEFILTEREND";
  
  private var _report;
  private var _log;
  private var _filterQuestions;
  private var _parameterUtilities;
  
  function FilterPage(report, parameterUtilities, log) {
    _report = report;
    _log = log;
    _parameterUtilities = parameterUtilities;
    _filterQuestions = ReportMetaData.GetFilterQuestions(report, Config.DS_Main);   
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
  
  function GetGlobalFilterExpression() {
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
      if (codes.length > 0) {
        filterExpressionSegments.push ('IN(' + _filterQuestions[i].QuestionId + ',' + codes.join(',') + ')');
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
    for (var i = 0; i < codes.length; ++i) {
      codes[i] = '"' + codes[i] + '"';
    }
    return codes;
  }
  
  function GetFilterText() {
    var filterTexts = [];
    _log.LogDebug("GetFilterText 1");
    filterTexts = filterTexts.concat(GetDateFilterText());
    _log.LogDebug("GetFilterText 2");
    var parameterFilterText = GetParamFilterText();
    _log.LogDebug("GetFilterText 3");
    if(parameterFilterText != null) {
      filterTexts.push(parameterFilterText);
    }
    _log.LogDebug("GetFilterText 4");
    if(filterTexts.length > 0) {
      var filterSummary = filterTexts.join('<span class=SelectorHeading> AND </span>');
      filterSummary += " <button class='btn btn-xs btn-cancel-filter' onclick='clickClearFiltersButton()'><span class='badge'>x</span></button>";
      return filterSummary;
    }
    _log.LogDebug("GetFilterText 5");
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
      if (selectedFilterCodes.length > 0) {
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