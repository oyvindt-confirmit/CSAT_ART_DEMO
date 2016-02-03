class FilterPage {
  static const FilterComponentsIdentifier = "filterComponents";
  
  static function HideFilterComponent(pageContext, filterNumber) {
    return pageContext.Items[FilterComponentsIdentifier].HideFilter(filterNumber)
  }
  
  static function CreateFilterTitle(text, pageContext, filterNumber) {
    var filterTitle = pageContext.Items[FilterComponentsIdentifier].FilterHeading(filterNumber);
    text.Output.Append(filterTitle);
  }
  
  static function SetUpPage(page, report, state, pageContext, log) {
    log.LogDebug("SetUpPage 1");
    var parameterUtilities = new ParameterUtilities(report, state, log);
    log.LogDebug("SetUpPage 2");
    var filterComponents = new FilterComponents(report, parameterUtilities, log);
    log.LogDebug("SetUpPage 3");
    pageContext.Items.Add(FilterComponentsIdentifier, filterComponents);
    log.LogDebug("SetUpPage 4");
    filterComponents.SetFilterParameters(page); 
    log.LogDebug("SetUpPage 5");
    filterComponents.RedirectToLastPage(page);
log.LogDebug("SetUpPage 6");
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    log.LogDebug("SetUpPage 7");
    pageTemplate.Process(null);
    log.LogDebug("SetUpPage 8");
  }
}