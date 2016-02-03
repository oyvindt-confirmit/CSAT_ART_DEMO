public class Config { 
  
  static var DS_Main = "ds0";
  static var CustomerLogo = null;
  static var CustomDateFormat = 'dd-MMM-yyyy';  
  static var DateVariableId = 'interview_start';
  static var Time = {
    CalendarType: CalendarType.Default
  };
  static public var Colors = {
    DefaultColor: '#233871' 
  };
  static var Include80PctSigTesting = true;
  static var MaxNumberOfQuestionsOnAllQuestionsPage = 100;
  static var VariablesToPutAtEndOfList = ["status","lastchannel","lastdevicetype","lastrenderingmode","first_question_on_last_page_displayed"];
  static var RangeGaps = [{
      Label: "My Range Gap",
      Top: {Min: 8, Max: 9},
      Bottom: {Min: 0, Max: 4}
    },{
      Label: "My Other Range Gap",
      Top: {Min: 4, Max: 5},
      Bottom: {Min: 1, Max: 2}     
    }
  ];
  static var Ranges = [{
      Label: "Range 6-9", 
      Max: 9,
      Min: 6
    },{
      Label: "Range 1-5",
      Max: 5,
      Min: 1     
    }
  ];
  static var Positioning = {
    MinimumResponses: 0,
    Quadrants: {
      UpperLeft: {
        Label: "Upper Left",
        Color: "#FEE6C2"
      },
      UpperRight: {
        Label: "Upper Right",
        Color: "#DFEFC4"
      },
      LowerLeft: {
        Label: "Lower Left",
        Color: "#F9D0D8"
      },
      LowerRight: {
        Label: "Lower Right",
        Color: "#D1E5F8"
      }     
    }
  }
  static var ResponseRateDetailsOnOverview = true;
}