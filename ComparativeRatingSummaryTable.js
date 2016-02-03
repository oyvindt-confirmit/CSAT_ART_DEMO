class ComparativeRatingSummaryTable {
  private var _parameterUtilities;
  private var _values;
  private var _log;
  
  function ComparativeRatingSummaryTable(report, parameterUtilities, log) {
    _parameterUtilities = parameterUtilities;
    _values = report.TableUtils.GetColumnValues("SummaryHiddenTable", 1);
    _log = log;
  } 
  
  function GetScorecardTableExpression() {
	var epression = GetScorecardTableRowExpression();
	return epression;
  }
  
  private function GetScorecardTableRowExpression() {
    var summaryCommon = new ComparativeRatingSummaryCommon(_parameterUtilities);
    var metrics = _parameterUtilities.GetParameterCodes('SCORECARD_METRICS');      
    var rowsExpression = [];	
    for (var i = 0; i < metrics.length; ++i) {		
      var headers = [];
      headers.push(metrics[i] + '{collapsed:true;totals:true;title:true}');
      var nestedHeaders = summaryCommon.CreateNestedHeaders();
      if(nestedHeaders.length > 0) {
      	headers.push(nestedHeaders.join('/'));
      }
      rowsExpression.push(headers.join('/'));
    }
    return rowsExpression.join('+');
  }
  
  function CreateScorecardTableColumnHeaders() {
    var tableDefinition = GetTableDefinition();
    var columnHeaders = [];
    for(var i = 0; i < tableDefinition.TableHeaderDefinitions.length; i++) {
      var columnHeader = CreateColumnHeader(tableDefinition.TableHeaderDefinitions[i], tableDefinition.TotalNumberOfRows);
      if(columnHeader != null) {
        columnHeaders.push(columnHeader);
      }
    }
    return columnHeaders;
  }
  
  private function GetTableDefinition() {
    var tableHeaderDefinitions = [{
        statisticsNumber: "0",
        hiddenTableRow: 0,
        decimals: 0,
        percent: false,
        label: "N"
      },{
        statisticsNumber: "1",
        hiddenTableRow: 1,
        decimals: 1,
        percent: false,
        label: "Avg"
      },{
        statisticsNumber: "2",
        hiddenTableRow: 2,
        decimals: 1,
        percent: false,
        label: "St.Dev."
      },{
        statisticsNumber: "7",
        hiddenTableRow: 6,
        decimals: 1,
        percent: true,
        label: "Top"
      },{
        statisticsNumber: "3",
        hiddenTableRow: 8,
        decimals: 1,
        percent: true,
        label: "Top 2"
      },{
        statisticsNumber: "4",
        hiddenTableRow: 10,
        decimals: 1,
        percent: true,
        label: "Top 3"
      },{
        statisticsNumber: "8",
        hiddenTableRow: 12,
        decimals: 1,
        percent: true,
        label: "Bottom"
      },{
        statisticsNumber: "5",
        hiddenTableRow: 14,
        decimals: 1,
        percent: true,
        label: "Bottom 2"
      },{
        statisticsNumber: "6",
        hiddenTableRow: 16,
        decimals: 1,
        percent: true,
        label: "Bottom 3"
      },{
        statisticsNumber: "9",
        hiddenTableRow: 19,
        decimals: 1,
        percent: false,
        label: "NPS®"
      }
    ];
    var totalNumberOfRows = 19;
    if(Config.RangeGaps !== null && Config.RangeGaps.length > 0) {
      for(var i = 0; i < Config.RangeGaps.length; ++i) {
        totalNumberOfRows += 3;
        var id = (100 + i).toString();
        tableHeaderDefinitions.push({
          statisticsNumber: id,
          hiddenTableRow: totalNumberOfRows,
          decimals: 1,
          percent: false,
          label: Config.RangeGaps[i].Label
        });        
      }
    }
    if(Config.Ranges !== null && Config.Ranges.length > 0) {
      for(var i = 0; i < Config.Ranges.length; ++i) {
        totalNumberOfRows += 2;
        var id = (200 + i).toString();
        tableHeaderDefinitions.push({
          statisticsNumber: id,
          hiddenTableRow: totalNumberOfRows,
          decimals: 1,
          percent: true,
          label: Config.Ranges[i].Label
        });        
      }
    }
    var tableDefinition = {
      TableHeaderDefinitions: tableHeaderDefinitions,
      TotalNumberOfRows: totalNumberOfRows
    }
    return tableDefinition;
  }
  
  private function CreateColumnHeader(tableHeaderDefinition, totalNumberOfRows) {
    if(_parameterUtilities.Contains('SCORECARD_STATISTICS', tableHeaderDefinition.statisticsNumber)) {
      var index = 0;
      var headerContent: HeaderContent = new HeaderContent();
      headerContent.Decimals = tableHeaderDefinition.decimals;
      headerContent.Title = new Label(9, tableHeaderDefinition.label);
      headerContent.Percent = tableHeaderDefinition.percent;
      for(var i = tableHeaderDefinition.hiddenTableRow; i < _values.length; i = i + totalNumberOfRows + 1) {
        if(_values[i].IsEmpty) {
          headerContent.SetCellValue(index, "");
        }
        else {
          headerContent.SetCellValue(index, _values[i].Value);
        }
        index++;
      }
      return headerContent;
    }   
  }
}