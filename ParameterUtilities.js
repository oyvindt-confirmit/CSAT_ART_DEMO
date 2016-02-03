class ParameterUtilities {
  private var _report;
  private var _state;
  private var _log;
  
  function ParameterUtilities(report, state, log) {
    _report = report;
    _state = state;
    _log = log;
  }
  
  // Summary:
  // LoadParameter is used to add possible values to a string response parameter.
  //
  // Parameter inputs:
  //   * report - The Reportal scripting report object
  //   * parameter - The parameter the possible values will be added to 
  //   * parameter_values - An array of objects with a property Code and a property Label.
  //        Example: [{Code: "1", Label: "Answer 1"}, {Code: "2", Label: "Answer 2"}]
  // Returns:
  //   * Nothing returned
  //
  static function LoadParameterValues(report, parameter, parameterValues) {
    for (var i=0; i<parameterValues.length; ++i) {   
      var parameterValueResponse : ParameterValueResponse = new ParameterValueResponse(); 
      parameterValueResponse.StringKeyValue = parameterValues[i].Code;
      
      var labels : LanguageTextCollection = new LanguageTextCollection(); 
      labels.Add(new LanguageText(report.CurrentLanguage, parameterValues[i].Label)); 
      
      parameterValueResponse.LocalizedLabel = new Label(labels);
      parameterValueResponse.StringValue = parameterValues[i].Label;
      
      parameter.Items.Add(parameterValueResponse);
    }
  }
  
  function ClearParameter(parameterName) {
    _state.Parameters[parameterName] = null;
  }
  
  function ClearParameters(parameterNames : String[]) {
    for (var i = 0; i < parameterNames.length; ++i) {
      ClearParameter(parameterNames[i])
    }
  }
  
  // Summary:
  // Selected is used to return the selected object in parameter based on the code
  // that is currently selected in the parameter.
  //
  // Parameter inputs:
  //   * report - The Reportal scripting report object
  //   * state - The Reportal scripting state object.
  //   * dataSourceNodeId - The id of the data source node the parameters are based on.
  //   * parameterName - The name of the parameter`
  // Returns:
  //   * The object matching the currently selected code from the parameter.
  //
  function Selected(dataSourceNodeId, parameterName) {
    var parameterValues = GetParameterList(dataSourceNodeId, parameterName);
    var currentCode = GetParameterCode(parameterName);
    for(var i = 0; i < parameterValues.length; i++) {
      if(parameterValues[i].Code == currentCode)
        return parameterValues[i];    
    }
  }

  function Selected(parameterName) {
    var parameterValues = ParameterLists.GetParameterValues(parameterName, _report, _log);
    var currentCode = GetParameterCode(parameterName);
    for(var i = 0; i < parameterValues.length; i++) {
      if(parameterValues[i].Code == currentCode) {
        return parameterValues[i];
      }
    }
  }
  
  function Contains(parameterName, code) {
  	var codes = GetParameterCodes(parameterName);
    for (var i = 0; i < codes.length; ++i) {
      if (codes[i].toUpperCase() == code.toUpperCase()) {
        return true;
      }
    }
    return false;
  }
  
  function SaveValueResponse(parameterName, value) {
    var parameterValueResponse : ParameterValueResponse = new ParameterValueResponse();	
    parameterValueResponse.StringKeyValue = value;
    parameterValueResponse.StringValue = value;
    var labelTexts : LanguageTextCollection = new LanguageTextCollection(); 
    labelTexts.Add(new LanguageText(_report.CurrentLanguage, value)); 
    parameterValueResponse.LocalizedLabel = new Label(labelTexts);
    _state.Parameters[parameterName] = parameterValueResponse;
  }  
  
  // Summary:
  // GetParamCode is used to get the current code value of a given string response parameter
  // where the string response parameter has an associated list of selectable items.
  //
  // Parameter inputs:
  //   * state - The Reportal scripting state object.
  //   * parameter_name - The name of the string response parameter to get the value from.
  // Returns:
  //   * The string code value of the given parameter. If the parameter does not have a string
  //     code value null is returned.
  //
  function GetParameterCode(parameterName : String) : String {
    if (_state.Parameters.IsNull(parameterName)) {
      return null;
    }
    var parameterValueResponse : ParameterValueResponse = _state.Parameters[parameterName];   
    return parameterValueResponse.StringKeyValue;
  }
 

  // Summary:
  // GetParamCodes is used to get the code values of a given multi select parameter.
  //
  // Parameter inputs:
  //   * state - The Reportal scripting state object.
  //   * parameter_name - The name of the string response multi select parameter to get the 
  //     value from.
  // Returns:
  //   * An array of string values with the selected items of the multi select parameter passed
  //     in the the function. If no string values are selected an empty array is returned.
  //
  function GetParameterCodes(parameterName : String) : String[] {
    var parameterValues : ParameterValueMultiSelect = _state.Parameters[parameterName];
    var codes = [];
    if(parameterValues != null) {
      for (var enumerator : Enumerator = new Enumerator(parameterValues) ; !enumerator.atEnd(); enumerator.moveNext()) {
        var parameterValue : ParameterValueResponse = enumerator.item();
        codes.push(parameterValue.StringKeyValue);
      }
      return codes;
    }
    else {
      return null;
    }    
  }
  
  function GetParameterDecimal(parameterName : String, defaultValue) {
    if(!_state.Parameters.IsNull(parameterName)) {
      return decimal.ToDouble(_state.Parameters.GetDecimal(parameterName));
    }
    else {
      if(defaultValue && defaultValue != null) {
        return defaultValue;
      }
      return null;
    }
  }
  
  function GetParameterString(parameterName : String, defaultValue) {
    if(!_state.Parameters.IsNull(parameterName)) {
      return _state.Parameters.GetString(parameterName);
    }
    else {
      if(defaultValue && defaultValue != null) {
        return defaultValue;
      }
      return null;
    }
  }
  
  function GetParameterDate(parameterName) {
    if(!_state.Parameters.IsNull(parameterName)) {
      return _state.Parameters.GetDate(parameterName);
    }
    return null;
  }
   
  function GetParameterList(dataSourceNodeId: String, parameterName: String) : Object[] {
    var paramValues = ParameterLists.GetParameterValues(parameterName, _report, _log);
    return paramValues; 
  }
}