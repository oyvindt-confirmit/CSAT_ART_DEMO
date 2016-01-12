class FixedParameterLists {
  static function GetParameterValues(parameterName) { 
    switch (parameterName.toUpperCase())
    { 
      case "BASE":
        return GetBaseOptions();
      case "CROSSTAB_TRENDING":
      case 'SCORECARD_TRENDING':
        return GetTrendingOptions();
      case "DECIMALS":
        return GetDecimalsOptions();
      case "RESPONSERATE_LABELS":
      case "TRENDLABELS":
        return GetLabelToggleOptions();
      case "RESPONSERATE_TRENDUNIT":
        return GetResponseRateTrendUnit();
      case "SCORECARD_STATISTICS":
        return GetScorecardStatistics();
      case 'SIGTEST':
        return GetSigtestOptions();
      case "STATS":
        return GetStatsOptions();
      case 'TOTALS':
        return GetTotalsToggleOptions();
      case 'TRENDING':
        return GetTrendingToggleOptions();
      case "TRENDING_INTERVAL":
      case "TRENDPAGE_INTERVAL":
        return GetTrendPageInterval();
      case 'TRENDPAGE_STATISTIC':
        return GetTrendPageStatistic();
      case 'TRENDPAGE_UNIT':
        return GetTrendPageUnit();
    }
  }

  private static function GetBaseOptions() {
   	return [
      {Code: '1', Label: 'Count: On', N: true, Percent: true},
      {Code: '2', Label: 'Count: Off', N: false, Percent: true}
   	];
  }

  private static function GetDecimalsOptions() {
   	return [
      {Code: '0', Label: 'Decimals: 0', Decimals: 0},
      {Code: '1', Label: 'Decimals: 1', Decimals: 1},
      {Code: '2', Label: 'Decimals: 2', Decimals: 2},
      {Code: '3', Label: 'Decimals: 3', Decimals: 3},
    ];
  }

  static function GetLabelToggleOptions() {
    return [
             {Code:'1', Label:'Off', Totals:true},
             {Code:'2', Label:'On', Totals:false}
           ];
  }

  static function GetResponseRateTrendUnit() {
    return [
            {Code:"0", Label: 'Day', Unit: RollingUnitType.Day, Delta: 0},
            {Code:"1", Label: 'Week', Unit: RollingUnitType.Week, Delta: 0},
            {Code:"2", Label: 'Month', Unit: RollingUnitType.Month, Delta: 0},
            {Code:"3", Label: 'Quarter', Unit: RollingUnitType.Quarter, Delta: 0},
            {Code:"4", Label: 'Year', Unit: RollingUnitType.Year, Delta: 0}
          ];  
  }

  private static function GetScorecardStatistics() {
    var fixedStatistics =  [
      {Code: "0", Label: "Count"},
      {Code: "1", Label: "Average"},
      {Code: "2", Label: "St. Dev."},
      {Code: "7", Label: "Top 1 %"},
      {Code: "3", Label: "Top 2 %"},
      {Code: "4", Label: "Top 3 %"},
      {Code: "8", Label: "Bottom 1 %"},
      {Code: "5", Label: "Bottom 2 %"},
      {Code: "6", Label: "Bottom 3 %"},
      {Code: "9", Label: "NPS &reg;"}
    ]; 
    if(Config.RangeGaps !== null && Config.RangeGaps.length > 0) {
      var rangeGapBaseId = 100;
      for(var i = 0; i < Config.RangeGaps.length; ++i) {
        var id = rangeGapBaseId + i;
        fixedStatistics.push({Code: id, Label: Config.RangeGaps[i].Label});
      }
    }
    return fixedStatistics;
  }

  static function GetTrendingOptions() {
    return [
            {Code: 'ALL', Label: 'All Data'},
            {Code: '1', Label: 'Current Year', Unit: RollingUnitType.Year, Delta: 0},
            {Code: '2', Label: 'Previous Year', Unit: RollingUnitType.Year, Delta: -1},
            {Code: '3', Label: 'Current Quarter', Unit: RollingUnitType.Quarter, Delta: 0},
            {Code: '4', Label: 'Previous Quarter', Unit: RollingUnitType.Quarter, Delta: -1},
            {Code: '5', Label: 'Current Month', Unit: RollingUnitType.Month, Delta: 0},
            {Code: '6', Label: 'Previous Month', Unit: RollingUnitType.Month, Delta: -1},
            {Code: '7', Label: 'Current Week', Unit: RollingUnitType.Week, Delta: 0},
            {Code: '8', Label: 'Previous Week', Unit: RollingUnitType.Week, Delta: -1},
            {Code: '0', Label: 'Custom Dates'}
          ];
  }

  static function GetSigtestOptions() {
    if(Config.Include80PctSigTesting == true) {
      return [
             {Code:'1', Label:'Sig: Off', Enabled:false }, 
             {Code:'2', Label:'Sig: T-Test 80%', Enabled:true, Type: SignificanceTestType.TTest, ConfidenceLevel:ConfidenceLevel.Eighty},
             {Code:'3', Label:'Sig: T-Test 95%', Enabled:true, Type: SignificanceTestType.TTest, ConfidenceLevel:ConfidenceLevel.NinetyFive},
             {Code:'4', Label:'Sig: T-Test 99%', Enabled:true, Type: SignificanceTestType.TTest, ConfidenceLevel:ConfidenceLevel.NinetyNine},
             {Code:'5', Label:'Sig: Chi-Square', Enabled:true, Type: SignificanceTestType.ChiSquare}
           ];
    }
    else {
      return [
             {Code:'1', Label:'Sig: Off', Enabled:false },     
             {Code:'2', Label:'Sig: T-Test 95%', Enabled:true, Type: SignificanceTestType.TTest, ConfidenceLevel:ConfidenceLevel.NinetyFive},
             {Code:'3', Label:'Sig: T-Test 99%', Enabled:true, Type: SignificanceTestType.TTest, ConfidenceLevel:ConfidenceLevel.NinetyNine},
             {Code:'4', Label:'Sig: Chi-Square', Enabled:true, Type: SignificanceTestType.ChiSquare}//,
           ];
    }
  }

  private static function GetStatsOptions() {
   	return [
      {Code: '1', Label: 'Statistics: On', Statistics: true},
      {Code: '2', Label: 'Statistics: Off', Statistics: false}
   	];
  }

  static function GetTotalsToggleOptions() {
    return [
             {Code:'1', Label:'Totals: On', Totals:true},
             {Code:'2', Label:'Totals: Off', Totals:false}
           ];
  }

  static function GetTrendingToggleOptions() {
    return [
             {Code:'1', Label:'Trends: Off', Trending:false},
             {Code:'2', Label:'Trends: On', Trending:true}
           ];
  }

  static function GetTrendPageInterval() {
    return [
            {Code:'0', Label:'(Show All)'},
            {Code:'2', Label:'2', Interval: 2},
            {Code:'3', Label:'3', Interval: 3},
            {Code:'4', Label:'4', Interval: 4},
            {Code:'5', Label:'5', Interval: 5},
            {Code:'6', Label:'6', Interval: 6},
            {Code:'7', Label:'7', Interval: 7},
            {Code:'8', Label:'8', Interval: 8},
            {Code:'9', Label:'9', Interval: 9},
            {Code:'10', Label:'10', Interval: 10},
            {Code:'11', Label:'11', Interval: 11},
            {Code:'12', Label:'12', Interval: 12}
          ];
  }

  static function GetTrendPageStatistic() {
    return [
      {Code: "0", Label: "Count"},
      {Code: "1", Label: "Average"},
      {Code: "2", Label: "St. Dev."},
      {Code: "7", Label: "Top 1 %"},
      {Code: "3", Label: "Top 2 %"},
      {Code: "4", Label: "Top 3 %"},
      {Code: "8", Label: "Bottom 1 %"},
      {Code: "5", Label: "Bottom 2 %"},
      {Code: "6", Label: "Bottom 3 %"},
      {Code: "9", Label: "NPS &reg;"}
    ];
  }

  static function GetTrendPageUnit() {
    return [
            {Code:"1", Label: 'Week', Unit: RollingUnitType.Week, Delta: 0},
            {Code:"2", Label: 'Month', Unit: RollingUnitType.Month, Delta: 0},
            {Code:"3", Label: 'Quarter', Unit: RollingUnitType.Quarter, Delta: 0},
            {Code:"4", Label: 'Year', Unit: RollingUnitType.Year, Delta: 0}
          ];  
  }
}