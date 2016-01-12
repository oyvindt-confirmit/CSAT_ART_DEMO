class TimeUtilities {
  static var CustomTimePeriods = 3;
  static var DateParameterNames = ['StartDate', 'EndDate'];
  private var _report;
  private var _parameterUtilities;
  private var _log;
  
  function TimeUtilities(report, parameterUtilities, log) {
    _report = report;
    _parameterUtilities = parameterUtilities;   
    _log = log;
  }

  function CreateTrendHeader(trend, interval) {
    var project : Project = _report.DataSource.GetProject(Config.DS_Main);
    var questionnaireElement : QuestionnaireElement = new QuestionnaireElement(project, Config.DateVariableId);
    var headerQuestion : HeaderQuestion = new HeaderQuestion(questionnaireElement);
    headerQuestion.TimeSeries.FiscalCalendarId = new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff");
    headerQuestion.ShowTotals = false;
    headerQuestion.TimeSeries.RollingTimeseries = CreateRollingTimeSeries(trend, interval);
    headerQuestion.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
    if(trend.Unit != RollingUnitType.Year)
      headerQuestion.TimeSeries.Time2 = GetTimeseriesUnit(trend);
    headerQuestion.HeaderId = "dt";   
    return headerQuestion;
  }
  
  function CreateRollingTimeSeries(selected, interval) {
    var rollingTimeSeries : RollingTime = new RollingTime();
    rollingTimeSeries.Enabled = true;
    rollingTimeSeries.Unit = selected.Unit;
    rollingTimeSeries.To = selected.Delta;
    rollingTimeSeries.From = selected.Delta - parseInt (interval);
    return rollingTimeSeries;
  }
  
  function GetTimeseriesUnit(selected) {
    switch(selected.Unit)
    {
      case RollingUnitType.Year:
        return null; 
      case RollingUnitType.Quarter:
        return TimeseriesTimeUnitType.Quarter;
      case RollingUnitType.Month:
        return TimeseriesTimeUnitType.Month;
      case RollingUnitType.Week:
        return TimeseriesTimeUnitType.Week;
      default:
        return null;    
    }
  }
    
  function TimeseriesExpression(dateVariableId) {
    // Insert Date Segments for selected period (and possible comparison periods)
	var expression = '';
	var firstLabel = '';
    var code = _parameterUtilities.GetParameterCode('TIMEPERIOD');
    switch (parseInt(code)) {    
      // Check for Custom   
      case TimePeriod.Custom:
        expression = GetCustomPeriods(dateVariableId);
        return {
          Expression: expression,
          FirstLabel: firstLabel
        };
      default:
        return {
          Expression: Config.DateVariableId + '{id:dt; totals:false}',
          FirstLabel: firstLabel
        };
      } 
  }
  
  function GetCustomPeriods(dateVariable) {
    var expressionSections = [];
    for (var i = 1; i <= CustomTimePeriods; ++i) {
      var expressionSection = GetCustomPeriod(dateVariable, i);
      if (expressionSection != null && expressionSection != '') {
        expressionSections.push ('(' + expressionSection + ')');
      }
    }
    return '(' + expressionSections.join('+') + ')';	
  }
	
  function GetCustomPeriod(dateVariable, idx) {
    var suffix = idx;
    var startParameterName = DateParameterNames[0] + suffix;
    var endParameterName = DateParameterNames[1] + suffix;
		
    var startDate : DateTime = _parameterUtilities.GetParameterDate(startParameterName);
    var endDate : DateTime = _parameterUtilities.GetParameterDate(endParameterName);
      
    if(startDate != null && endDate != null) {
      var label = CreateCustomDateLabel(startDate, endDate);
      var startDateFormatted = startDate.ToString("yyyy-MM-dd");
      var endDateFormatted = endDate.ToString("yyyy-MM-dd");
      var filter = CreateFilter(startDateFormatted, endDateFormatted, dateVariable);		
      return CreateSegmentExpression(label, filter);
    }
    return null;
  }
  
  function CreateSegmentExpression(label, filter) {
    return "([SEGMENT]{label:" + _report.TableUtils.EncodeJsString( label ) + ";expression:" + _report.TableUtils.EncodeJsString( filter ) + "})";
  }
  
  function CreateFilter(startDateFormatted, endDateFormatted, dateVariable) {
    var filterExpressionSections = [];
    filterExpressionSections.push(dateVariable + '>= TODATE("' + startDateFormatted + '")');
    filterExpressionSections.push(dateVariable + '<= TODATE("' + endDateFormatted + '")');
    return filterExpressionSections.join(' AND ');
  }
  
  function GetDateParameterValue(state, parameterName) {
    return state.Parameters.IsNull(parameterName)
			? null
			: state.Parameters.GetDate(parameterName);
  }
  
  function CreateCustomDateLabel(startDate, endDate) {
    if (startDate == null && endDate == null) {
      return '(No Time Filter)'
    }
    else {
      var labelSections = [];
      labelSections.push(startDate == null ? '' : startDate.ToShortDateString());
      labelSections.push(endDate == null ? '' : endDate.ToShortDateString());
      return labelSections.join(' - ');
    }    
  }
}

class TimePeriod {
  static const Custom = 0;
  static const YearToDate = 1;
  static const PreviousYear = 2;
  static const QuarterToDate = 3;
  static const PreviousQuarter = 4;
  static const MonthToDate = 5;
  static const PreviousMonth = 6;
  static const Yesterday = 7;
}

class CalendarType {
  static const Default = 1;
  static const Fiscal = 2;
}