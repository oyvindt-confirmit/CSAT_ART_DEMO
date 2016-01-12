class DashboardPage {
  private var _report;
  private var _metaData;
  private var _log;
  private var _dashboardQuestions;
  private var _numberOfDashboardQuestions;
  
  private const SingleIcon = "fa-dot-circle-o";
  private const MultiIcon = "fa-check-square-o";
  private const GridIcon = "fa-th";
  
  function DashboardPage(report, metaData, log) {
    _report = report;
    _metaData = metaData;
    _log = log;
    _dashboardQuestions = _metaData.GetQuestionsByCategory(Config.DS_Main, "dashboard", true);
    _numberOfDashboardQuestions = _dashboardQuestions.length;
  }
  
  function GetGaugeProperties() {
    var gaugeCharts = [];
    for(var i = 0; i < _dashboardQuestions.length && i < 6; ++i) {
      var question = _dashboardQuestions[i];
      if(question.QuestionType == QuestionType.Single || (question.QuestionType == QuestionType.Grid && question.Answers.length == 1)) {
        if(QuestionProperties.HasScores(question)) {
          var dashboardChartNumber = i+1;
          var dashboardChartIdentifier = "chart" + dashboardChartNumber;
          var maxAndMinScores = QuestionProperties.MaxAndMinScores(question);
          gaugeCharts.push({
            chartId: dashboardChartIdentifier,
            yAxisMin: maxAndMinScores.Min,
            yAxisMax: maxAndMinScores.Max,
            color: Config.Colors.DefaultColor
          });
        }
      }
    }
    return gaugeCharts;
  }
  
  function HideDashboard(dashboardChartNumber) {
    return (dashboardChartNumber > _numberOfDashboardQuestions);
  }
  
  function CreateDashboardTable(table, dashboardChartNumber) {
    if(_numberOfDashboardQuestions > dashboardChartNumber - 1) { 
      var question = _dashboardQuestions[dashboardChartNumber - 1];
      AddRowHeader(table, question);
      if(question.QuestionType == QuestionType.Grid) {
        SetGridSpecificProperties(table, question);
      }
      SortTable(table, question);
    }
  }
  
  private function AddRowHeader(table, question) {
    var headerQuestionProperties = GetHeaderQuestionProperties(question)
    var rowsExpression = TableUtil.CreateQuestionExpression(question.QuestionId, question, headerQuestionProperties, false);
    table.AddHeaders(_report, Config.DS_Main, rowsExpression);
  }
  
  private function GetHeaderQuestionProperties(question) {
    var headerQuestionProperties = [];
    headerQuestionProperties.push("totals:false");
    if(question.QuestionType == QuestionType.Multi || question.QuestionType == QuestionType.Grid || QuestionProperties.HasScores(question)) {
      headerQuestionProperties.push("collapsed:true");
    }
    return headerQuestionProperties.join(";");
  }

  private function SetGridSpecificProperties(table, question) {
    if(QuestionProperties.HasScores(question)) {
      AddStatisticsColumnHeader(table);
    }
    else {
      table.Distribution = CreateDistribution();
      AddCategoriesColumnHeader(table);
    }
  }
  
  private static function AddStatisticsColumnHeader(table) {
    var statistics : HeaderStatistics = new HeaderStatistics();
    statistics.Statistics.Avg = true;
    table.ColumnHeaders.Add(statistics);
  }
  
  private static function CreateDistribution() {
    var distribution : DistributionFormat = new DistributionFormat();
    distribution.Count = false;
    distribution.HorizontalPercents = true;
    distribution.VerticalPercents = false;
    return distribution;
  }
   
  private static function AddCategoriesColumnHeader(table) {
    var categories : HeaderCategories = new HeaderCategories();
    categories.Totals = false;
    table.ColumnHeaders.Add(categories);
  }
  
  private static function SortTable(table, question) {
    TableUtil.ApplySorting(table, question, 0, 1);
  }
  
  function CreateDashboardChartTitle(dashboardChartNumber, inExport) {
    if(_numberOfDashboardQuestions > dashboardChartNumber-1) {
      if(inExport) {
        return _dashboardQuestions[dashboardChartNumber-1].Title; 
      }
      else {
        return CreateChartTitleIcon(_dashboardQuestions[dashboardChartNumber-1].QuestionType) + " " + _dashboardQuestions[dashboardChartNumber-1].Title; 
      }         
    }
    return "";
  }
  
  private function CreateChartTitleIcon(questionType) {
    switch(questionType) {
      case QuestionType.Single:
        return '<i class="fa ' + SingleIcon + '"></i>';
      case QuestionType.Multi:
        return '<i class="fa ' + MultiIcon + '"></i>';
      default:
        return '<i class="fa ' + GridIcon + '"></i>';        
    }
  }
  
  function DisplayLegend(chart, chartNumber) {
    if(_numberOfDashboardQuestions > chartNumber - 1) {     
      var question = _dashboardQuestions[chartNumber - 1];
      if(question.QuestionType == QuestionType.Grid) {
        if(QuestionProperties.HasScores(question)) {
          chart.Legend.Enabled = false; 
        }
        else {
          chart.Legend.Enabled = true; 
        }
      }
    }
  }
}