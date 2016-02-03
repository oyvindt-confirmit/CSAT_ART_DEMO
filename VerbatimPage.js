class VerbatimPage {
  static function SetUpPage(page, report, state, pageContext, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var pageTemplate = new PageTemplate(page, report, parameterUtilities, log);
    pageTemplate.Process("verbatims");
    pageTemplate.SetNumberOfSelectionsToPageContext(pageContext, "VERBATIM", "numberOfVerbatims");
  }
  
  static function CreateHitlist(hitlist, report, state, log) {
    var project = report.DataSource.GetProject(Config.DS_Main);
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var verbatimHitlist = new VerbatimHitlist(project, parameterUtilities, log);
    var columns = verbatimHitlist.AddHitlistColumns(hitlist);
    hitlist.Columns.AddRange(columns);
  }
  
  static function CreateHitlistFilter(filter, report, state, log) {
    var parameterUtilities = new ParameterUtilities(report, state, log);
    var verbatimFilter = new VerbatimFilter(parameterUtilities);
    filter.Expression = verbatimFilter.CreateVerbatimFilterExpression();
  }
}