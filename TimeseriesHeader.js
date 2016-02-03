class TimeSeriesHeader {
  private var _table;
  private var _log;
  private var _trendUnit;
  private var _trendInterval;
  const TimeVariableHeaderId = "dt";
  
  function TimeSeriesHeader(table, parameterValues, log) {
    _table = table;
    _trendUnit = parameterValues.Unit;
    _trendInterval = parameterValues.Interval;
    _log = log;
  }
  
  function CreateBaseTimeseriesExpression(totals) {
    return CreateBaseTimeseriesExpression(totals, Config.DateVariableId);
  }
  
  function CreateBaseTimeseriesExpression(totals, dateVariableId) {
    return dateVariableId + "{id:" + TimeVariableHeaderId + "; totals:" + totals + "}";
  }
  
  function SetTimeUnitAndTrending() {
    var headerQuestion : HeaderQuestion = TableUtil.GetHeaderById(_table, TimeVariableHeaderId);
    headerQuestion.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
    headerQuestion.TimeSeries.Time2 = GetTimeseriesUnit();
    if(_trendUnit != null && _trendUnit.Unit == RollingUnitType.Day) {
      headerQuestion.TimeSeries.Time3 = TimeseriesTimeUnitType.DayOfMonth;
    }
    if(_trendInterval != null && _trendInterval.Interval != null) {
      var rollingTimeSeries = CreateRollingTimeSeries();
      headerQuestion.TimeSeries.RollingTimeseries = rollingTimeSeries;
    }
    headerQuestion.TimeSeries.FiscalCalendarId = new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff");
  }
  
  function GetTimeseriesUnit() {
    if(_trendUnit != null) {
    switch(_trendUnit.Unit) {
      case RollingUnitType.Year:
        return TimeseriesTimeUnitType.Undefined; 
      case RollingUnitType.Quarter:
        return TimeseriesTimeUnitType.Quarter;
      case RollingUnitType.Month:
        return TimeseriesTimeUnitType.Month;
      case RollingUnitType.Week:
        return TimeseriesTimeUnitType.Week;
      case RollingUnitType.Day:
        return TimeseriesTimeUnitType.Month;
      default:
        return TimeseriesTimeUnitType.Week;    
    }
    }
    else {
      return TimeseriesTimeUnitType.Week;
    }
  }
  
  function CreateRollingTimeSeries(selected, interval) {
    var rollingTimeSeries : RollingTime = new RollingTime();
    rollingTimeSeries.Enabled = true;
    rollingTimeSeries.Unit = _trendUnit.Unit;
    rollingTimeSeries.To = _trendUnit.Delta;
    rollingTimeSeries.From = _trendUnit.Delta - parseInt(_trendInterval.Interval);
    return rollingTimeSeries;
  }
  
  function SetReversedAndFlatLayout() {
    var headerQuestion : HeaderQuestion = TableUtil.GetHeaderById(_table, TimeVariableHeaderId);
    headerQuestion.TimeSeries.FlatLayout = true;
    headerQuestion.TimeSeries.ReverseOrder = true;
  }
  
  function SetDateFormatForWeeks() {
    if(_trendUnit == null || _trendUnit.Code === '1') {
      TableUtil.UpdateDateFormatByTable(_table, _log);
    }
  }
}