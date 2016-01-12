class VerbatimFilter {
  private var _parameterUtilities;
  private var _log;
  
  function VerbatimFilter(parameterUtilities, log) {
    _parameterUtilities = parameterUtilities;
    _log = log;
  }
   
  function CreateVerbatimFilterExpression() {
    var verbatimQuestionIds = _parameterUtilities.GetParameterCodes("VERBATIM");
    var filterExpressionSegments = [];
    if(verbatimQuestionIds != null) {
      for(var i = 0; i < verbatimQuestionIds.length; ++i) {
        filterExpressionSegments.push("(NOT ISNULL(" + verbatimQuestionIds[i] + "))");
      }
    }
    return filterExpressionSegments.join(" OR ");
  }
}