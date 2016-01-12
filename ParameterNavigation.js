class ParameterNavigation {
  
  private var _report;
  private var _state;
  private var _parameterUtilities;
  private var _log;
  
  function ParameterNavigation(report, state, parameterUtilities, log) {
    _report = report;
    _state = state;
    _parameterUtilities = parameterUtilities;
    _log = log;
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