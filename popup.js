chrome.storage.local.get(null, function(items) {
  let all_keys= Object.keys(items);
  for(let key of all_keys) {
    $('#urls').append(key + '<br>');
  }
});