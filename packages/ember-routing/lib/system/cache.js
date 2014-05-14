import EmberObject from "ember-runtime/system/object";

var Cache = EmberObject.extend({
  init: function() {
    this.cache = {};
  },
  has: function(bucketKey) {
    return bucketKey in this.cache;
  },
  calculateBucketKey: function(qp, handlerInfo) {
    var names = handlerInfo._names,
        modelParams = handlerInfo.params || qp.route.serialize(handlerInfo.context, names);

    var suffixes = "";
    if (qp.cacheType === 'model') {
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

