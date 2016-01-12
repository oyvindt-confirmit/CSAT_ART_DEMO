class JSONTableUtilities {
  static function LeafHeaders(JSONAggregatedTableHeaders) {
    var leafHeadersList = [];
    for(var i : int = 0; i < JSONAggregatedTableHeaders.length; ++i) {
      var hdr = JSONAggregatedTableHeaders[i];
      if(hdr.subcells === undefined)
        leafHeadersList[leafHeadersList.length] = hdr;
      else {
        var children = LeafHeaders(hdr.subcells);
      	var k : int = leafHeadersList.length;
      	for(var j: int = 0; j < children.length; ++j) {
          leafHeadersList[j+k] = children[j];
      	}
      }
  	}
  	return leafHeadersList;
  }
}