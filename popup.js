chrome.storage.local.get(null, function(items) {
  let all_keys= Object.keys(items);
  for(let key of all_keys) {
    $('#urls').append('<div><a href="' + decodeURIComponent(key) + '">' + decodeURIComponent(key) + '</a></div>');
  }
  $('#urls').on('click', (e) => {
    chrome.tabs.create({url: $(e.target).attr('href')});
  });
});