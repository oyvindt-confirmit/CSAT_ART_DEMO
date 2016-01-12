class ResponseRateTable {
  private var _timeseriesHeader;
  private var _log;
  
  function ResponseRateTable(timeseriesHeader, log) {
    _timeseriesHeader = timeseriesHeader;
    _log = log;
  }
  
  function CreateResponseRateTableExpression() {
    var rowExpression = _timeseriesHeader.CreateBaseTimeseriesExpression(true, "CreatedDate");
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
  
  function CreateResponseRateTableForChartExpression() {
    var rowExpression = _timeseriesHeader.CreateBaseTimeseriesExpression(true, "CreatedDate");
    var columnExpression = [];
    columnExpression.push('smtpstatus{mask:messagesent;total:false}');
    columnExpression.push('[CONTENT]{percent:true;label:"Response Rate"}');
    return rowExpression + "^" + columnExpression.join("+");
  }

  function PostTableGenerationProcessing() {
    _timeseriesHeader.SetTimeUnitAndTrending();
    _timeseriesHeader.SetReversedAndFlatLayout();
  }
}