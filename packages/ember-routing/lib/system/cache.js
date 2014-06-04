import EmberObject from "ember-runtime/system/object";

var Cache = EmberObject.extend({
  init: function() {
    this.cache = {};
  },
  has: function(bucketKey) {
    return bucketKey in this.cache;
  },
  calculateBucketKey: function(qp, _handlerInfo, handlerInfos) {
    var handlerInfo = _handlerInfo,
        names = handlerInfo._names;

    var suffixes = "";
    if (qp.cacheType === 'model') {

      if (names.length === 0 ) {
        // Find the first dynamic parent route.
        var found = false;
        for (var h = handlerInfos.length - 1; h >= 0; --h) {
          var info = handlerInfos[h];
          if (found && info._names.length) {
            handlerInfo = info;
            break;
          } else if (info === _handlerInfo) {
            found = true;
          }
        }
      }

      names = handlerInfo._names;
      var modelParams = handlerInfo.params || qp.route.serialize(handlerInfo.context, names);
      for (var k = 0, klen = names.length; k < klen; ++k) {
        var name = names[k];
        var value = modelParams[name];
        suffixes += "::" + name + ":" + value;
      }
    }

    return qp.route.routeName + suffixes;
  },
  stash: function(bucketKey, key, value) {
    var bucket = this.cache[bucketKey];
    if (!bucket) {
      bucket = this.cache[bucketKey] = {};
    }
    bucket[key] = value;
  },
  lookup: function(bucketKey) {
    return this.cache[bucketKey];
  },
  cache: null
});

export default Cache;

