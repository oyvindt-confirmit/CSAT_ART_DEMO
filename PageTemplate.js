class PageTemplate {
  private var _page;
  private var _report;
  private var _parameterUtilities;
  private var _log;
  
  function PageTemplate(page, report, parameterUtilities, log) {
    _page = page;
    _report = report;
    _parameterUtilities = parameterUtilities;
    _log = log;
  }
  
  function Process(pageId) {
    if(pageId) {
      _parameterUtilities.SaveValueResponse("LASTPAGE_ID", pageId);
    }
    switch(_page.SubmitSource) {       
      case "ClearFilters":
        ClearFilters();
        break;
    }   
  }
  
  function ClearFilters() {
    var filterQuestions = ReportMetaData.GetFilterQuestions(_report, Config.DS_Main, _log);
    for (var i = 0; i < filterQuestions.length; ++i) {
      var filterParameterName = 'FILTER' + (i+1);
      _parameterUtilities.ClearParameter(filterParameterName);
    }
    _parameterUtilities.ClearParameter("GLOBALDATEFILTERSTART");
    _parameterUtilities.ClearParameter("GLOBALDATEFILTEREND");
    _parameterUtilities.ClearParameter("FILTERS_SELECTED_EXPRESSION");
    _parameterUtilities.ClearParameter("FILTERS_SELECTED_SUMMARY");
  }
  
  function SetUpPreviousNextNavigation(parameterName) {
    var parameterNavigation = new ParameterNavigation(_report, _parameterUtilities, _log);
    parameterNavigation.SetUpPreviousNextNavigation(_page, parameterName);
  }
  
  function RedirectToComparativeRatingSetup() {
    var scorecardMetricsParameterName = "SCORECARD_METRICS";
    var scorecardStatisticsParameterName = "SCORECARD_STATISTICS";
    var destinationPageId = "scorecard_setup";
    if(_parameterUtilities.GetParameterCodes(scorecardMetricsParameterName) == null || _parameterUtilities.GetParameterCodes(scorecardStatisticsParameterName) == null) {
      _page.NextPageId = destinationPageId;
    }
  }
  
  function RedirectToCrosstabSetup() {
    var parameterName = "Banners";
    var destinationPageId = "crosstab_setup";
    RedirectToSetup(parameterName, destinationPageId)
  }
  
  function RedirectToPositioningSetup() {
    var parameterName = "POSITIONING_METRIC_1";
    var destinationPageId = "positioning_setup";
    RedirectToSetup(parameterName, destinationPageId)
  }
  
  private function RedirectToSetup(parameterName, destinationPageId) {
    var parameterValue = _parameterUtilities.GetParameterString(parameterName);
    if(parameterValue == null) {
      _page.NextPageId = destinationPageId;
    }
  }
  
  function SetNumberOfSelectionsToPageContext(pageContext, parameterName, entryIdentifier) {
    if(_parameterUtilities.GetParameterCodes(parameterName) != null) {
      var numberOfSelections = _parameterUtilities.GetParameterCodes(parameterName).length;
      pageContext.Items.Add(entryIdentifier, numberOfSelections);
    }
    else {
      pageContext.Items.Add(entryIdentifier, 0);
    }
  }
}