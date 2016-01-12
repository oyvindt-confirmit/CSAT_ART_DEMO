class ReportMetaData
{
  static var DashboardQuestions = {};
  static var FilterQuestions = {};
  static var DemographicQuestions = {};
  static var VerbatimQuestions = {};
  static var MetricQuestions = {};
  static var ParameterUtilities;
  
  static function GetDashboardQuestions(report, datasourceId, log) {
    var project : Project = report.DataSource.GetProject(datasourceId);
    var cacheKey = [datasourceId, project.ProjectId, report.CurrentLanguage].join('_');
    if(DashboardQuestions[cacheKey] == null)
    {
      var metaData = new MetaData(report, log);
      var dashboardQuestions = project.GetQuestionsWithAnswers(false, ["dashboard"]);
      DashboardQuestions[cacheKey] = {Questions: metaData.CreateLocalQuestionList(dashboardQuestions, true), Timestamp: DateTime.Now};
      return DashboardQuestions[cacheKey].Questions;
    }
    else
    {
      return DashboardQuestions[cacheKey].Questions;
    }
  }
  
  static function GetFilterQuestions(report, datasourceId, log)
  {
    var project : Project = report.DataSource.GetProject(datasourceId);
    var cacheKey = [datasourceId, project.ProjectId, report.CurrentLanguage].join('_');
    if(FilterQuestions[cacheKey] == null)
    {
      var metaData = new MetaData(report, log);
      var filterQuestions = project.GetQuestionsWithAnswers(false, ["filter"]);
      FilterQuestions[cacheKey] = {Questions: metaData.CreateLocalQuestionList(filterQuestions, false), Timestamp: DateTime.Now};
      return FilterQuestions[cacheKey].Questions;
    }
    else
    {
      return FilterQuestions[cacheKey].Questions;
    }
  }
  
  static function GetDemoQuestions(report, datasourceId, log)
  {
    var project : Project = report.DataSource.GetProject(datasourceId);
    var cacheKey = [datasourceId, project.ProjectId, report.CurrentLanguage].join('_');
    if(DemographicQuestions[cacheKey] == null)
    {
      var metaData = new MetaData(report, log);
      var demoQuestions = project.GetQuestionsWithAnswers(false, ["demo"]);
      DemographicQuestions[cacheKey] = {Questions: metaData.CreateLocalQuestionList(demoQuestions, false), Timestamp: DateTime.Now};
      return DemographicQuestions[cacheKey].Questions;
    }
    else
    {
      return DemographicQuestions[cacheKey].Questions;
    }
  }
  
  static function GetVerbatimQuestions(report, datasourceId, log)
  {
    var project : Project = report.DataSource.GetProject(datasourceId);
    var cacheKey = [datasourceId, project.ProjectId, report.CurrentLanguage].join('_');
    if(VerbatimQuestions[cacheKey] == null)
    {
      var metaData = new MetaData(report, log);
      var demoQuestions = project.GetQuestionsWithAnswers(false, ["verbatim"]);
      VerbatimQuestions[cacheKey] = {Questions: metaData.CreateLocalQuestionList(demoQuestions, false), Timestamp: DateTime.Now};
      return VerbatimQuestions[cacheKey].Questions;
    }
    else
    {
      return VerbatimQuestions[cacheKey].Questions;
    }
  }
}