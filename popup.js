class Popup {
  constructor() {
  }

  declareRemoveButton() {
    $('.removeButton').on('click', function() {
      let url = $(this).prev('a').attr('href');
      chrome.storage.local.remove(url, function(){
        console.log(url);
      });
    });
  }

  showHiddenUrls(id_name) {
    chrome.storage.local.get(null, (items) => {
      // 非表示対象のURLを表示
      let all_keys= Object.keys(items);
      for(let key of all_keys) {
        $('#' + id_name).append('<div class="hiddenContent"><a href="' + decodeURIComponent(key) + '">' + decodeURIComponent(key) + '</a><button class="removeButton" type=button>close</button></div>');
      }
    
      $('#' + id_name).on('click', 'a', (e) => {
        chrome.tabs.create({url: $(e.target).attr('href')});
      });
      this.declareRemoveButton();
    });
  }
}

let popup_action = new Popup();
popup_action.showHiddenUrls('urls');