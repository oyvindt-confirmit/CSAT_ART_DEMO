class TableUtil {
  static function AddFrontChartColumn(report, table, rowCount, log) {
    // Add Chart Inside Table
    var chartComboValues = CreateChartComboValues();
    var headerChartCombo = CreateHeaderChartCombo(report, chartComboValues);
    table.ColumnHeaders.Insert(0, headerChartCombo);
    var formulaExpression = "IF (row=rows OR row>=" + rowCount + ", EMPTYV(), CELLV(col+1,row)/CELLV(col+1, " + rowCount + ") )";
    var headerFormula = CreateHeaderFormula(formulaExpression);
    table.ColumnHeaders.Insert(1, headerFormula);
  }
  
  private static function CreateChartComboValues() {
    var chartComboValue : ChartComboValue = new ChartComboValue();
    chartComboValue.Name = "";
    chartComboValue.BaseColor = new ChartComboColorSet([Config.Colors.DefaultColor]);
    chartComboValue.Expression = "CELLV(col+1,row)";

    var chartComboValue2 : ChartComboValue = new ChartComboValue();
    chartComboValue2.Name = "";
    chartComboValue2.BaseColor = new ChartComboColorSet(['#FFF']);
    chartComboValue2.Expression = "1-CELLV(col+1,row)";

    return [chartComboValue, chartComboValue2];
  }
  
  private static function CreateHeaderChartCombo(report, chartComboValue) {
    var headerChartCombo : HeaderChartCombo = new HeaderChartCombo();
    headerChartCombo.Size = 200;
    headerChartCombo.Thickness = "90%";
    headerChartCombo.Title = new Label(report.CurrentLanguage, "Response Distribution");
    headerChartCombo.TypeOfChart = ChartComboType.Bar;
    headerChartCombo.Values = chartComboValue;
    headerChartCombo.HideHeader = true;
    return headerChartCombo;
  }
  
  private static function CreateHeaderFormula(expression) {
    var headerFormula : HeaderFormula = new HeaderFormula();
    headerFormula.Type = FormulaType.Expression;
    headerFormula.HideData = true;
    headerFormula.Expression = expression;
    return headerFormula;
  }
  
  static function ApplySorting(table, question, rowHeaderPosition, sortPosition) {
    if(QuestionProperties.IsInCategory(question, "sort")) {
      var sortInfo = CreateSortInfo(sortPosition);
      var headerQuestion : HeaderQuestion = table.RowHeaders[rowHeaderPosition];
      headerQuestion.Sorting = sortInfo;
    }
  }
  
  private static function CreateSortInfo(sortPosition) {
    var sortInfo : SortInfo = new SortInfo();
    sortInfo.Enabled = true;
    sortInfo.Direction = TableSortDirection.Descending;
    sortInfo.SortByType = TableSortByType.Position;
    sortInfo.Position = sortPosition;
    return sortInfo;
  }
  
  static function CreateQuestionExpression(variableId, question, headerQuestionProperties, includeTitle) {
    var rowExpression = [];
    if(question.QuestionType == QuestionType.Multi) {
      rowExpression.push(CreateMultiAnySegment(question, includeTitle))
    }
    rowExpression.push(variableId + '{' + headerQuestionProperties + '}');
    return rowExpression.join("/");
  }
  
  private static function CreateMultiAnySegment(question, includeTitle) {
    var segmentProperties = "";
    if(includeTitle) {
      segmentProperties = "hideheader:false;label:\"" + question.Title + "\"";
    }
    else {
      segmentProperties = "hideheader:true";
    }
    return '[SEGMENT]{' + segmentProperties + ';expression:"' + CreateMultiAnyFilter(question) + '"}';
  }
  
  private static function CreateMultiAnyFilter(question) {
    var expression = [];
    expression.push("ANY(" + question.QuestionId + ",");
    var codes = [];
    for(var i = 0; i < question.Answers.length; i++) {
      codes.push("\\\"" + question.Answers[i].Code + "\\\"");
    }
    expression.push(codes.join(","));
    expression.push(")");
    return expression.join("");
  }
  
  static function UpdateDateFormatByTable(table) {
    var headerCollection = [];
    for (var i=0; i < table.RowHeaders.Count; ++i) {
      headerCollection.push(table.RowHeaders[i]);
    }
    for (var i=0; i<table.ColumnHeaders.Count; ++i) {
      headerCollection.push(table.ColumnHeaders[i]);
    }
    UpdateDateFormatByHeaderCollection(headerCollection);
  }
  
  private static function UpdateDateFormatByHeaderCollection(headerCollection) {
    // Loop over collection
    for (var i=0; i < headerCollection.length; ++i) {
      // Update current Header
      var header = headerCollection[i];  	       	
      if (header.HeaderType == HeaderVariableType.QuestionnaireElement) {
        header.TimeSeries.FlatLayout = true;
        header.TimeSeries.DateFormat = TimeSeriesDateFormatType.Custom;
        header.TimeSeries.CustomFormat = Config.CustomDateFormat;
      }
      // See if there's a match in that header's Child Branches
      var subHeaders = [];
      for (var j=0; j < headerCollection[i].SubHeaders.Count; ++j) {
        subHeaders.push( headerCollection[i].SubHeaders[j] );
      }
      UpdateDateFormatByHeaderCollection(subHeaders);
    }
  }
  
  static function ReplaceColumnHeadersById(table, id, newHeader, log) {
    ReplaceMatches(table.ColumnHeaders, id, newHeader, log);
  }
  
  private static function ReplaceMatches(headersCollection, id, newHeader, log) {
	for (var i = 0; i < headersCollection.Count; ++i) {  
	  if(headersCollection[i].HeaderId == id) {
        var tempHeader = newHeader;
        if(tempHeader.SubHeaders == null || tempHeader.SubHeaders.Count == 0) {
          tempHeader.SubHeaders.AddRange(headersCollection[i].SubHeaders);
        }
        headersCollection[i] = tempHeader;
        tempHeader = null;
      }
	  // See if there's a match in that header's Child Branches
      if(headersCollection[i].SubHeaders != null) {
        ReplaceMatches(headersCollection[i].SubHeaders, id, newHeader, log);
      }
    }
  }
  
  static function GetHeaderById(table, id) {
	var headers = [];
    for (var i = 0; i < table.RowHeaders.Count; ++i) {
      headers.push(table.RowHeaders[i]);
    }
    for (var i = 0; i < table.ColumnHeaders.Count; ++i) {
      headers.push(table.ColumnHeaders[i]);
    }
	return FindMatchingHeader(headers, id);
  }
	
  private static function FindMatchingHeader(collection, id) {
	for (var i = 0; i < collection.length; ++i) {
      if (collection[i].HeaderId == id) {
        return collection[i];
      }
	  // See if there's a match in that header's Child Branches
	  var childHeaders = [];
      for (var j = 0; j < collection[i].SubHeaders.Count; ++j) {
        childHeaders.push(collection[i].SubHeaders[j]);
      }
	  var match = FindMatchingHeader(childHeaders, id);
      if(match != null) {
        return match;
      }
	}
	// No match
	return null;
  }
}