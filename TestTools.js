class TestTools {  
  static function SendErrorEmail(confirmit, report, results, log) {
    var testResults = new TestResults(report, results);
    var plainTextBody = testResults.GetPlaintextBody();
    var htmlBody = testResults.GetHtmlBody();
    confirmit.SendMail(TestConfig.SenderEmailAddress, TestConfig.RecipientEmailAddress, "Errors in report: " + report.Name, plainTextBody, "", "", 2, -1, htmlBody);
  }
}

class TestResults {
  var TotalNumberOfAsserts;
  private var _plaintextErrors = [];
  private var _htmlErrors = [];
  private var _report;
  private var _log;
  
  function TestResults(report, testResults, log) {
    TotalNumberOfAsserts = testResults.length;
    _report = report;
    _log = log;
    for(var i = 0; i < testResults.length; ++i) {
      var testResult = testResults[i];
      if(testResult != null && !testResult.success) {
        _plaintextErrors.push(testResult.plainTextMessage);
        _htmlErrors.push(testResult.htmlMessage);
      }
    }
  }
  
  function GetPlaintextBody() {
    var plaintextBody = "Errors were found when running tests in report: " + _report.Name + ".\n\n";
    plaintextBody += TotalNumberOfAsserts + " asserts were made. " + _plaintextErrors.length + " asserts failed.\n\n";
    plaintextBody += _plaintextErrors.join("\n\n");
    return plaintextBody;
  }
  
  function GetHtmlBody() {
    var htmlBody = "Errors were found when running tests in report " + _report.Name + ".<br><br>";
    htmlBody += "<b>" + TotalNumberOfAsserts + "</b> asserts were made. <b>" + _htmlErrors.length + "</b> asserts failed.<br><br>";
    htmlBody += _htmlErrors.join("<br><br>");
    return htmlBody;
  }
}