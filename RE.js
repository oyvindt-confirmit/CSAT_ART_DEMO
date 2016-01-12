class RE
{
  static function JSONstringify(obj, log) 
  {
    function escapeEntities(str) {
      var entitiesMap = {             
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        };
        return str.replace(/[&<>]/g, function(key) {
            return entitiesMap[key];
        });
    }
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    }
    else {
      if(log)
        log.LogDebug("Start recursion: " + obj.minimumResponses);
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
      if(log)
        log.LogDebug("Start recursion: " + obj.minimumResponses);
        for (n in obj) {
          	if(log)
              log.LogDebug(n);
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+ escapeEntities(v) +'"';
            else if (t == "object" && v !== null) v = JSONstringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
  }
}