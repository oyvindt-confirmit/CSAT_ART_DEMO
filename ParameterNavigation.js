class ParameterNavigation {
  
  private var _report;
  private var _parameterUtilities;
  private var _log;
  
  function ParameterNavigation(report, parameterUtilities, log) {
    _report = report;
    _parameterUtilities = parameterUtilities;
    _log = log;
  }
  
  function SetUpPreviousNextNavigation(page, parameterName) {
    switch(page.SubmitSource) {
      case "Next":
	    NextParameterValue(Config.DS_Main, parameterName);
        break;    
      case "Previous":
	    PreviousParameterValue(Config.DS_Main, parameterName);
        break;
    }
  }
  
  function NextParameterValue(ds, parameterName) {
    NavigateParameter(ds, parameterName, NextPreviousNavigation.Next);
  }
	
  function PreviousParameterValue(ds, parameterName) {
    NavigateParameter(ds, parameterName, NextPreviousNavigation.Previous);
  }
  
  private function NavigateParameter(ds, parameterName, naviagation) {
    var parameterState = GetParameterState(ds, parameterName);
    var index = GetNextOrPreviousIndex(parameterState, naviagation);
    var code = parameterState.ParameterValues[index].Code;
    _parameterUtilities.SaveValueResponse(parameterName, code);
  }
  
  private function GetParameterState(ds, parameterName) {
    var code = _parameterUtilities.GetParameterCode(parameterName);
    var parameterValues = GetParameterValues(ds, parameterName);
    return {
      ParameterValues: parameterValues,
      CurrentIndex: FindIndexForCode(parameterValues, code)
    }
  }
  
  private function GetParameterValues(ds, parameterName) {
    return ParameterLists.GetParameterValues(parameterName, _report, _log); 
  }
  
  private function FindIndexForCode(parameterValues, code) {
    for (var i = 0; i < parameterValues.length; ++i) {
      if (parameterValues[i].Code == code) {
        return i;
      }
    }
  } 
  
  private function GetNextOrPreviousIndex(parameterState, naviagation) {
    switch(naviagation)
    {
      case NextPreviousNavigation.Next:
        return (parameterState.CurrentIndex == parameterState.ParameterValues.length - 1) ? 0 : (parameterState.CurrentIndex + 1);
      case NextPreviousNavigation.Previous:
        return (parameterState.CurrentIndex == 0) ? (parameterState.ParameterValues.length - 1) : (parameterState.CurrentIndex - 1);
    }
  }  
}

public enum NextPreviousNavigation {
  Next,
  Previous
}