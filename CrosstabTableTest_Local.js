class CrosstabTable_Tests {
  private static var defaultParameterValues = {
    "BASE" : {Code: '1', Label: 'Base: On', N: true, Percent: true},
    "DECIMALS": {Code: '1', Label: 'Decimals: 1', Decimals: 1},
    "TOTALS": {Code:'1', Label:'Totals: On', Totals:true},
    "STATS": {Code: '1', Label: 'Statistics: On', Statistics: true},
    "SIGTEST": {Code:'1', Label:'Sig: Off', Enabled: false },
    "CROSSTAB_TRENDING": {Code: 'ALL', Label: 'All Data'},
    "recodings": null,
    "Banners": null
  };
  private var _report;
  private var _log;
  
  function CrosstabTable_Tests(report, log) {
    _log = log;
    _report = report;
  }

  function CreateTableExpression_SingleWithNoScoresAndNoSortingInRows_ExpressionCreated() {
    var expected = 'singleNoScoreNoSorting{title:true;totals:true;collapsed: false}^[SEGMENT]{label:"Total"}/(([N]{hidedata:true}+[FORMULA]{label:"n";decimals:0;expression:"CELLVALUE(col-1,row)";hidedata:false}+[SEGMENT]{hideheader:true; label:"Pct"}))';
    var parameterValues = defaultParameterValues;
	parameterValues["QUESTION"] = ["singleNoScoreNoSorting"];
	var parameterUtilities = new ScorecardHiddenTable_Tests_ParameterUtilities(parameterValues);
    var metaData = new CrosstabTableTests_MetaData();
    var timeUtilities = new TimeUtilities(_report, parameterUtilities, _log);
    var crosstabTable = new CrosstabTable(_report, null, parameterUtilities, metaData, timeUtilities, _log);
    var tableExpression = crosstabTable.CreateTableExpression();
    return Assert.AreEqual(expected, tableExpression);
  }
  
  function CreateTableExpression_SingleWithNoScoresAndWithSortingInRows_OneQuestionInSortedHeadersList() {
    var expected = 1;
    var parameterValues = defaultParameterValues;
	parameterValues["QUESTION"] = ["singleNoScoreWithSorting"];
	var parameterUtilities = new ScorecardHiddenTable_Tests_ParameterUtilities(parameterValues);
    var metaData = new CrosstabTableTests_MetaData();
    var timeUtilities = new TimeUtilities(_report, parameterUtilities, _log);
    var crosstabTable = new CrosstabTable(_report, null, parameterUtilities, metaData, timeUtilities, _log);
    crosstabTable.CreateTableExpression();
    return Assert.AreEqual(expected, crosstabTable.GetNumberOfSortedRowHeaders());
  }
  
  function CreateTableExpression_TwoQuestionsInRows_ExpressionGenerated() {
    var expected = 'singleNoScoreNoSorting{title:true;totals:true;collapsed: false}+singleNoScoreWithSorting{title:true;totals:true;collapsed: false}^[SEGMENT]{label:"Total"}/(([N]{hidedata:true}+[FORMULA]{label:"n";decimals:0;expression:"CELLVALUE(col-1,row)";hidedata:false}+[SEGMENT]{hideheader:true; label:"Pct"}))';
    var parameterValues = defaultParameterValues;
	parameterValues["QUESTION"] = ["singleNoScoreNoSorting", "singleNoScoreWithSorting"];
	var parameterUtilities = new ScorecardHiddenTable_Tests_ParameterUtilities(parameterValues);
    var metaData = new CrosstabTableTests_MetaData();
    var timeUtilities = new TimeUtilities(_report, parameterUtilities, _log);
    var crosstabTable = new CrosstabTable(_report, null, parameterUtilities, metaData, timeUtilities, _log);
    var tableExpression = crosstabTable.CreateTableExpression();
    return Assert.AreEqual(expected, tableExpression);
  }
  
  function CreateTableExpression_SingleWithScoresAndNoSortingInRows_ExpressionCreated() {
    var expected = 'singleWithScoreNoSorting{title:true;totals:true;collapsed: false;statistics:avg,stdev}^[SEGMENT]{label:"Total"}/(([N]{hidedata:true}+[FORMULA]{label:"n";decimals:0;expression:"CELLVALUE(col-1,row)";hidedata:false}+[SEGMENT]{hideheader:true; label:"Pct"}))';
    var parameterValues = defaultParameterValues;
	parameterValues["QUESTION"] = ["singleWithScoreNoSorting"];
	var parameterUtilities = new ScorecardHiddenTable_Tests_ParameterUtilities(parameterValues);
    var metaData = new CrosstabTableTests_MetaData();
    var timeUtilities = new TimeUtilities(_report, parameterUtilities, _log);
    var crosstabTable = new CrosstabTable(_report, null, parameterUtilities, metaData, timeUtilities, _log);
    var tableExpression = crosstabTable.CreateTableExpression();
    return Assert.AreEqual(expected, tableExpression);
  }
  
  function CreateSignificanceTestSettings_SignificanceTestingOff_SignificanceTestingOffInOptions() {    
    var parameterValues = defaultParameterValues;
	parameterValues["SIGTEST"] = {Enabled: false };
    var parameterUtilities = new ScorecardHiddenTable_Tests_ParameterUtilities(parameterValues);
    var metaData = new CrosstabTableTests_MetaData();
    var timeUtilities = new TimeUtilities(_report, parameterUtilities, _log);
    var crosstabTable = new CrosstabTable(_report, null, parameterUtilities, metaData, timeUtilities, _log);
    var significanceTestSettings = crosstabTable.CreateSignificanceTestSettings();
    return Assert.AreEqual(false, significanceTestSettings.SignificanceTesting);
  }
  
   function CreateSignificanceTestSettings_SignificanceTestingOnTTestNinityNine_SignificanceTestingOnInOptions() {    
    var parameterValues = defaultParameterValues;
    parameterValues["SIGTEST"] = {Enabled: true, Type: SignificanceTestType.TTest, ConfidenceLevel: ConfidenceLevel.NinetyNine};
    var parameterUtilities = new ScorecardHiddenTable_Tests_ParameterUtilities(parameterValues);
    var metaData = new CrosstabTableTests_MetaData();
    var timeUtilities = new TimeUtilities(_report, parameterUtilities, _log);
    var crosstabTable = new CrosstabTable(_report, null, parameterUtilities, metaData, timeUtilities, _log);
    var significanceTestSettings = crosstabTable.CreateSignificanceTestSettings();
    var results = []
	results.push.apply(results, Assert.AreEqual(true, significanceTestSettings.SignificanceTesting, "Sig.Test enabled"));
    results.push.apply(results, Assert.AreEqual(SignificanceTestType.TTest, significanceTestSettings.TestType, "Sig.Test test type"));
    results.push.apply(results, Assert.AreEqual(ConfidenceLevel.NinetyNine, significanceTestSettings.ConfidenceLevel, "Sig.Test confidence level"));
    return results;
  }
}