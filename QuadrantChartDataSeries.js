public class QuadrantChartDataSeries
{
  private var _tableDefinition;
  private var _minimumResponses;
  private var _log;
  
  public function QuadrantChartDataSeries(tableDefinition, minimumResponses, log) {
    _tableDefinition = tableDefinition;
    _minimumResponses = minimumResponses;
    _log = log;
  }
  
  public function ConvertToQuadrantDataSeries() {
    var rowHeaders = GetHeaders(_tableDefinition.rowheaders);
    return CreateData(rowHeaders);
  }
  
  private function GetHeaders(tableDefinitionHeaders) {
    var headers = []; 
    var leafHeaders = JSONTableUtilities.LeafHeaders(tableDefinitionHeaders, _log);
    for(var i = 0; i < leafHeaders.length; i++) 
      headers.push(Unescape(leafHeaders[i].text));
    return headers;
  }
  
  private function Unescape(inputString) {
    return unescape(inputString);
  }
  
  private function CreateData(rowHeaders) {
    var data = [];
    for(var i = 0; i < _tableDefinition.data.length; i++)
    {
      var dataRow = _tableDefinition.data[i];
      if(dataRow[0].values.avg && dataRow[2].values.avg && dataRow[1].values.count >= _minimumResponses && dataRow[3].values.count >= _minimumResponses )
      {
        var dataPoint = CreateDataPoint(rowHeaders[i], dataRow);
        data.push(dataPoint);
      }
    }
    return RE.JSONstringify(data);
  }
  
  private function CreateDataPoint(rowName, dataRow) {
    var xValue = Math.round(dataRow[0].values.avg*100)/100;
    var yValue = Math.round(dataRow[2].values.avg*100)/100;
    return {name: rowName, x: xValue, y: yValue};
  }
}