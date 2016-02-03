class ResponseRateTable {
  private var _table;
  private var _report;
  private var _timeseriesHeader;
  private var _log;
  
  private const ResponseRateTableName = "ResponseRateTable";
  private const TrendDateVariable = "CreatedDate";
  
  function ResponseRateTable(table, report, timeseriesHeader, log) {
    _table = table;
    _report = report;
    _timeseriesHeader = timeseriesHeader;
    _log = log;
  }
  
  function CreateResponseRateTable() {
    var tableExpression = CreateResponseRateTableExpression();
    _table.AddHeaders(_report, Config.DS_Main, tableExpression);
  }
  
  function CreateResponseRateTableExpression() {
    var rowExpression = _timeseriesHeader.CreateBaseTimeseriesExpression(true, TrendDateVariable);
    var columnExpression = [];
    columnExpression.push('smtpstatus{mask:messagesent;total:false}');
    columnExpression.push('[SEGMENT]{label:"No Response";expression:"IN(status,\\\"notanswered\\\",\\\"quotafull\\\",\\\"error\\\")"}');
    columnExpression.push('[SEGMENT]{label:"Partial";expression:"IN(status,\\\"incomplete\\\",\\\"screened\\\")"}');
    columnExpression.push('[SEGMENT]{label:"Full";expression:"IN(status,\\\"complete\\\")"}');
    columnExpression.push('[FORMULA]{label:"No Response %";expression:"If(Cellvalue(1,row) > 0, Cellvalue(col-3,row)/Cellvalue(1,row), 0)";percent:true}');
    columnExpression.push('[FORMULA]{label:"Partial %";expression:"If(Cellvalue(1,row) > 0, Cellvalue(col-3,row)/Cellvalue(1,row), 0)";percent:true}');
    columnExpression.push('[FORMULA]{label:"Full %";expression:"If(Cellvalue(1,row) > 0, Cellvalue(col-3,row)/Cellvalue(1,row), 0)";percent:true}');
    columnExpression.push('[FORMULA]{label:"Response Rate";expression:"(Cellvalue(col-2,row) + Cellvalue(col-1,row))/100";percent:true}');
    return rowExpression + "^" + columnExpression.join("+");
  }
  
  function CreateResponseRateTableForChart() {
    var tableExpression = CreateResponseRateTableForChartExpression();
    _table.AddHeaders(_report, Config.DS_Main, tableExpression);
  }
  
  function CreateResponseRateTableForChartExpression() {
    var rowExpression = _timeseriesHeader.CreateBaseTimeseriesExpression(true, TrendDateVariable);
    var columnExpression = [];
    columnExpression.push('smtpstatus{mask:messagesent;total:false}');
    columnExpression.push('[CONTENT]{percent:true;label:"Response Rate"}');
    return rowExpression + "^" + columnExpression.join("+");
  }

  function PostTableGenerationProcessing() {
    _timeseriesHeader.SetTimeUnitAndTrending();
    _timeseriesHeader.SetReversedAndFlatLayout();
    _timeseriesHeader.SetDateFormatForWeeks();
  }
  
  function SetResponseRateTableForChartValues() {
    var hc: HeaderContent = _table.ColumnHeaders[1];
    var colValues = _report.TableUtils.GetColumnValues(ResponseRateTableName, 8);
    for(var i = 0; i < colValues.length; ++i) {
      hc.SetCellValue(i, colValues[i].Value);
    }
  }
}