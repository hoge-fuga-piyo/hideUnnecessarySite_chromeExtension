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
      } else {
        $('#' + this.noContentId).hide();
      }

      // 非表示対象のURLを表示
      $('#' + this.urlsId).empty();
      for(let key of allKeys) {
        let content = '<tr><td>' +
            '<a href="' + decodeURIComponent(key) + '">' + decodeURIComponent(key) + '</a>' +
          '</td>' +
          '<td width=30px>' +
            '<span class="removeButton"></span>' +
          '</td></tr>';
        $(content).appendTo('#' + this.urlsId).hide().fadeIn(300);
      }
    
      $('#' + this.urlsId).on('click', 'a', (e) => {
        chrome.tabs.create({url: $(e.target).attr('href')});
      });
      this.declareRemoveButton();
    });
  }

  declareRemoveButton() {
    $('.removeButton').on('click', {num: this.hiddenContentNum, noContentId: this.noContentId}, function(e) {
      let url = $(this).parent().prev().find('a').attr('href');
      chrome.storage.local.remove(url, function(){});
      $(this).parent().parent().fadeOut(300, function() {
        $(this).remove();
      });
      e.data.num--;
      if(e.data.num === 0) {
        $('#' + e.data.noContentId).show(300);
      }
    });
  }
  
  addHiddenContent() {
    $(() => {
      $('.addButton').on('click', ()=> {
        let url = decodeURIComponent($('#newUrl').val());
        if(!this.isUrl(url)) {
          $('#errorInvalidUrl').show(200, function() {
            setTimeout(() => {
              $(this).hide(200);
            }, 1000);
          });
          return;
        }
        $('#errorInvalidUrl').hide(200);
        chrome.storage.local.set({[url] : true}, ()=> {
          this.showHiddenUrls();
        });
      });
    });
  }

  isUrl(url) {
    const urlPattern = /^(http|https):\/\/([a-z]|[A-Z]|[0-9])+\.([a-z]|[A-Z]|[0-9])/;
    if(url == '') {
      return false;
    }
    if(url.match(urlPattern)) {
      return true;
    }
    return false;
  }
}