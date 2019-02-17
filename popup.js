class Popup {
  constructor() {
  }

  showHiddenUrls(id_name) {
    chrome.storage.local.get(null, (items) => {
      let all_keys= Object.keys(items);

      // 非表示対象のURLがない場合
      if(all_keys.length === 0) {
        $('#' + id_name).append('<div>No hidden contents</div>')
      }

      // 非表示対象のURLを表示
      for(let key of all_keys) {
        $('#' + id_name).append('<div class="hiddenContent"><a href="' + decodeURIComponent(key) + '">' + decodeURIComponent(key) + '</a><button class="removeButton" type=button>close</button></div>');
      }
    
      $('#' + id_name).on('click', 'a', (e) => {
        chrome.tabs.create({url: $(e.target).attr('href')});
      });
      this.declareRemoveButton();
    });
  }

  declareRemoveButton() {
    $('.removeButton').on('click', function() {
      let url = $(this).prev('a').attr('href');
      chrome.storage.local.remove(url, function(){});
      $(this).parent('div').remove();
    });
  }
}

let popup_action = new Popup();
popup_action.showHiddenUrls('urls');