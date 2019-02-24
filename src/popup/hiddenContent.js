class HiddenContent {
  constructor(urlsId, noContentId) {
    this.urlsId = urlsId;
    this.noContentId = noContentId;
    this.hiddenContentNum = 0;
  }

  showHiddenUrls() {
    chrome.storage.local.get(null, (items) => {
      let allKeys= Object.keys(items);
      this.hiddenContentNum = allKeys.length;

      // 非表示対象のURLがない場合
      if(this.hiddenContentNum === 0) {
        $('#' + this.noContentId).show();
      }

      // 非表示対象のURLを表示
      $('#' + this.urlsId).empty();
      for(let key of allKeys) {
        $('#' + this.urlsId).append('<div class="hiddenContent"><a href="' + decodeURIComponent(key) + '">' + decodeURIComponent(key) + '</a><button class="removeButton" type=button>close</button></div>');
      }
    
      $('#' + this.urlsId).on('click', 'a', (e) => {
        chrome.tabs.create({url: $(e.target).attr('href')});
      });
      this.declareRemoveButton();
    });
  }

  declareRemoveButton() {
    $('.removeButton').on('click', {num: this.hiddenContentNum, noContentId: this.noContentId}, function(e) {
      let url = $(this).prev('a').attr('href');
      chrome.storage.local.remove(url, function(){});
      $(this).parent('div').remove();
      e.data.num--;
      if(e.data.num === 0) {
        $('#' + e.data.noContentId).show();
      }
    });
  }
  
  addHiddenContent() {
    $(() => {
      $('#addButton').on('click', ()=> {
        let url = decodeURIComponent($('#newUrl').val());
        chrome.storage.local.set({[url] : true}, ()=> {
          this.showHiddenUrls();
        });
      });
    });
  }
}