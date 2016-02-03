class ParameterLists {
  static function GetParameterValues(parameterName, report, log) {
    switch (parameterName.toUpperCase()) {  
      case "CROSSTAB":
      case "METRIC":
      case 'ONE_QUESTION':
      case "POSITIONING_METRIC_1":
      case "POSITIONING_METRIC_2":
      case "POSITIONING_DEMOGRAPHIC":
      case 'QUESTION':
      case 'QUESTIONS':
      case "SEGMENT":
      case 'SCORECARD_NESTING':
      case "VERBATIM":
      case "VERBATIM_DEMOGRAPHICS":
        return QuestionBasedParameterLists.GetParameterValues(parameterName, report, log);
      case "BASE":
      case "CROSSTAB_TRENDING":
      case "CROSSTAB_INDIVIDUAL_SCORES":
      case "DECIMALS":
      case "RESPONSERATE_LABELS":
      case "TRENDLABELS":
      case "RESPONSERATE_TRENDUNIT":
      case "SCORECARD_STATISTICS":
      case 'SCORECARD_TRENDING':
      case 'SIGTEST':
      case "STATS":
      case 'TOTALS':
      case 'TRENDING':
      case "TRENDING_INTERVAL":
      case "TRENDPAGE_INTERVAL":
      case 'TRENDPAGE_STATISTIC':
      case 'TRENDPAGE_UNIT':
        return FixedParameterLists.GetParameterValues(parameterName, log);
    }   
  }  
}