class ComparativeRatingSummaryCommon {
  private var _parameterUtilities;
  
  function ComparativeRatingSummaryCommon(parameterUtilities) {
    _parameterUtilities = parameterUtilities;
  }
  
  function CreateNestedHeaders()
  {
    var nestingLevel1 = _parameterUtilities.GetParameterCode('SCORECARD_NESTING_LEVEL_1');
    var nestingLevel2 = _parameterUtilities.GetParameterCode('SCORECARD_NESTING_LEVEL_2');
    var nestingHeaders = [];
    if (nestingLevel1 != null) {
      nestingHeaders.push (nestingLevel1 + '{totals:true}');
    }
    if (nestingLevel2 != null) {
      nestingHeaders.push (nestingLevel2 + '{totals:true}');
    }
    return nestingHeaders;
  }
}