class ReportSummary {
  private var _report;
  private var _ds;
  private var _project;
  private var _log;
  
  function ReportSummary(report, log) {
    _report = report;
    _ds = Config.DS_Main;
    _project = report.DataSource.GetProject(_ds);
    _log = log;
  }
   
  function CreateSummaryJavascript() {
    var summaryTable = CreateSummaryTable();
    var overviewValues = CreateOverviewValues(summaryTable);
    var visibleDashboardPage = (ReportMetaData.GetDashboardQuestions(_report, Config.DS_Main, _log).length !== 0);
    var visibleResponseRateDetails = Config.ResponseRateDetailsOnOverview;
    var reportSummary = {
      ReportName: _report.Name,
      SurveyName: FindProjectIdAndName(),
      OverviewValues: overviewValues,
      VisibleDashboarPage: visibleDashboardPage,
      VisibleResponseRateDetails: visibleResponseRateDetails
    }
    var javascript = [];
    javascript.push("<script>");
    javascript.push("var reportSummary = " + RE.JSONstringify(reportSummary));
    javascript.push("</script>");
    return javascript.join("\n");
  }
  
  function CreateSummaryTable() {
    var expression = [];
    expression.push("smtpstatus{mask:messagesent;totals:false;}");
    expression.push("status{mask:complete,incomplete;totals:false}");
    expression.push('[FORMULA]{expression:"IF(CELLVALUE(col, row-3)>0,(CELLVALUE(col,row-2)+CELLVALUE(col,row-1))/CELLVALUE(col,row-3),0)"}');
    var tableJSON = _report.TableUtils.GenerateTableFromExpression("ds0", expression.join("+") + "^[BASE]", TableFormat.Json);
    return eval("(" + tableJSON + ")");
  }
  
  function CreateOverviewValues(summaryTable) {
    var data = summaryTable.data;
    var responseRate = (data[3][0].values["default"] *100).toFixed(1);
    var sentInvites = data[0][0].values.basecount;
    var fullResponses = data[1][0].values.basecount;
    var partialResponses = data[2][0].values.basecount;
    var overviewValues = {
      SentInvites: sentInvites,
      Full: fullResponses,
      Partial: partialResponses,
      ResponseRate: responseRate + "%"
    }
    return overviewValues;
  }
  
  function FindProjectIdAndName() {
    return _project.ProjectName + " (" + _project.ProjectId + ")";
  }
}