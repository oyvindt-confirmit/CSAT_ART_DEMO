public class QuadrantChart
{
  private var _tableDefinition;
  private var _chartSettings;
  private var _log;

  public function QuadrantChart(aggregatedTableJsonData, chartSettings, log)
  {
    _tableDefinition = eval('(' + aggregatedTableJsonData + ')');
    _chartSettings = chartSettings;
    _log = log;
  }
  
  function GetQuadrantChartDataSeries() 
  {
    var quadrantChartDataSeries = new QuadrantChartDataSeries(_tableDefinition, _chartSettings.minimumResponses, _log);
    return quadrantChartDataSeries.ConvertToQuadrantDataSeries();
  }
}