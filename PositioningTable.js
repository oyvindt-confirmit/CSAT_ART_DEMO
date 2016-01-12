public class PositioningTable {
	private var _log;
	private var _settings;
    private var _parameterUtilities;  

	function PositioningTable(parameterUtilities, log) {
       _log = log;
       _parameterUtilities = parameterUtilities;
	   _settings = GetPositioningSettings();
	}

	private function GetPositioningSettings() {
		var settings = {};
		settings.xAxisQuestion = _parameterUtilities.GetParameterCode(PositioningParameters.Metric1);
		settings.yAxisQuestion = _parameterUtilities.GetParameterCode(PositioningParameters.Metric2);    
		settings.xCrossingPoint = _parameterUtilities.GetParameterDecimal(PositioningParameters.XAxisCrossingPoint);
		settings.yCrossingPoint = _parameterUtilities.GetParameterDecimal(PositioningParameters.YAxisCrossingPoint);
		settings.demographic = _parameterUtilities.GetParameterCode(PositioningParameters.Demographic);
		return settings;
	}

	function CreateQudrantTableExpression() {
		var rowsExpression = CreateRowExpression();
		var columnExpression = "(" + CreateQuadrantsColumnExpression() + ")";
		return rowsExpression + "^" + columnExpression;
	}

	function CreateStatisticsTableExpression() {
		var rowsExpression = CreateRowExpression();
		var columnExpression = "(" + CreateColumnStatisiticsExpression() + ")";
		return rowsExpression + "^" + columnExpression;
	}

	private function CreateRowExpression() {
		return _settings.demographic + "{totals:false}";
	}

	private function CreateColumnStatisiticsExpression() {
		var columnExpression = [];
		columnExpression.push(CreateQuestionHeaderWithStatistics(_settings.xAxisQuestion));
		columnExpression.push(CreateQuestionHeaderWithStatistics(_settings.yAxisQuestion));
		return columnExpression.join("+");
	}

	private function CreateColumnFormulaExpression() {
		var columnExpression = [];
		columnExpression.push('[FORMULA]{expression: "IF(CellValue(1,row) == EMPTYVALUE(), EMPTYVALUE(), IF(CellValue(1,row) > ' + _settings.xCrossingPoint + ', 1, 0))"}');
		columnExpression.push('[FORMULA]{expression: "IF(CellValue(2,row) == EMPTYVALUE(), EMPTYVALUE(), IF(CellValue(2,row) > ' + _settings.yCrossingPoint + ', 1, 0))"}');

		return columnExpression.join("+");
	}

	private function CreateQuadrantsColumnExpression()
	{
		var columnExpression = [];
		columnExpression.push(CreateColumnStatisiticsExpression());
		columnExpression.push(CreateColumnFormulaExpression());
		return columnExpression.join("+");
	}

	private function CreateQuestionHeaderWithStatistics(questionId) {
		return questionId + "{collapsed:true;statistics:avg,count}";
	}
}