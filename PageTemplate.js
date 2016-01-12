class PageTemplate {
  private var _parameterUtilities;
  private var _report;
  private var _log;
  
  function PageTemplate(report, parameterUtilities, log) {
    _report = report;
    _parameterUtilities = parameterUtilities;
    _log = log;
  }
  
  function Process(page, pageId) {
    if(pageId) {
      _parameterUtilities.SaveValueResponse("LASTPAGE_ID", pageId);
    }
    switch(page.SubmitSource) {       
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
}