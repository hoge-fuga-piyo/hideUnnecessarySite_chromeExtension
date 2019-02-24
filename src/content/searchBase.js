class SearchBase {
  constructor() {
    this.frameClassName = '';
    this.trashBoxButtonIdPrefix = 'trashBox';
    this.pickUpTrashButtonIdPrefix = 'pickUpTrash';
    this.hiddenContentButtonId = 'hiddenContentButton';
    this.trashUrlBackgroundColor = 'lightgrey';
    this.trashBoxInImgPath = chrome.runtime.getURL('img/trashBoxIn.png');
    this.trashBoxOutImgPath = chrome.runtime.getURL('img/trashBoxOut.png');
    this.trashBoxHideImgPath = chrome.runtime.getURL('img/trashBoxHide.png');
    this.trashBoxShowImgPath = chrome.runtime.getURL('img/trashBoxShow.png');
    this.hiddenContentSpaceId = 'hiddenContentSpace';
    this.hiddenContentNumId = 'hiddenContentNum';
    this.hiddenContentNum = 0;
    this.hiddenContentClass = "hiddenContet";
    this.hiddenContentState = "HIDE";
  }

  isHide(url) {
    return new Promise(function(resolve, reject){
      chrome.storage.local.get([url], function(value){
        const keys = Object.keys(value);
        if (value[keys[0]]) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    })
  }

  addPickUpTrashButton(element, index) {
    // interface
  }

  declareTrashBoxButton(element, url, index) {
    const id_name = this.trashBoxButtonIdPrefix + index;
    $('#' + id_name).on('click', () => {
      chrome.storage.local.set({[url] : true}, function(){});
      if(this.hiddenContentState === "HIDE") {
        $(element).slideUp(200, () => {
          $(element).css('background-color', this.trashUrlBackgroundColor);
        });
      } else {
        $(element).css('background-color', this.trashUrlBackgroundColor);
      }
      $('#' + id_name).remove();
      $(element).addClass(this.hiddenContentClass);
      this.addPickUpTrashButton(element, index);
      this.hiddenContentNum++;
      $('#' + this.hiddenContentNumId).text(this.hiddenContentNum);
    });
  }

  addTrashBoxButton(element, index) {
    // interface
  }

  declarePickUpTrashButton(element, url, index) {
    const id_name = this.pickUpTrashButtonIdPrefix + index;
    $('#' + id_name).on('click', () => {
      chrome.storage.local.remove(url, function() {
      });
      $(element).css('background-color', '');
      $(element).removeClass(this.hiddenContentClass);
      $('#' + id_name).remove();
      this.hiddenContentNum--;
      $('#' + this.hiddenContentNumId).text(this.hiddenContentNum);
      this.addTrashBoxButton(element, index);
    });
  }

  addHiddenContentButton() {
    // interface
  }

  declareHiddenContentButton() {
    $('#' + this.hiddenContentButtonId).on('click', () => {
      if(this.hiddenContentState === 'HIDE') {
        $('.' + this.hiddenContentClass).slideDown(200);
        $('#' + this.hiddenContentButtonId).attr('src', this.trashBoxShowImgPath);
        this.hiddenContentState = 'SHOW';
      } else {
        $('.' + this.hiddenContentClass).slideUp(200);
        $('#' + this.hiddenContentButtonId).attr('src', this.trashBoxHideImgPath);
        this.hiddenContentState = 'HIDE';
      }
    });
  }

  initHideAndShow(element, url, index) {
    this.isHide(url).then((isHide) => {
      if(isHide) {
        $(element).hide();
        $(element).css('background-color', this.trashUrlBackgroundColor);
        $(element).addClass(this.hiddenContentClass);
        this.addPickUpTrashButton(element, index);
      } else {
        this.addTrashBoxButton(element, index);
      }
    });
  }

  runExtension() {
    // interface
  }
}