class SearchBase {
  constructor() {
    this.frameClassName = '';
    this.trashBoxButtonIdPrefix = 'trashBox';
    this.pickUpTrashButtonIdPrefix = 'pickUpTrash';
    this.hiddenContentButtonId = 'hiddenContentButton';
    this.trashUrlBackgroundColor = 'lightgrey';
    this.trashBoxInImgPath = chrome.runtime.getURL('trashBoxIn.png');
    this.trashBoxOutImgPath = chrome.runtime.getURL('trashBoxOut.png');
    this.trashBoxImgPath = chrome.runtime.getURL('trashBox.png');
    this.hiddenContentSpaceId = 'hiddenContentSpace';
    this.hiddenContentNumId = 'hiddenContentNum';
    this.hiddenContentNum = 0;
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
      chrome.storage.local.set({[url] : true}, function(){
      });
      $(element).hide();
      $(element).css('background-color', this.trashUrlBackgroundColor);
      $('#' + id_name).hide();
      this.hiddenContentNum++;
      $('#' + this.hiddenContentNumId).text(this.hiddenContentNum);
      this.addPickUpTrashButton(element, index);
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
      $(element).show();
      $(element).css('background-color', '');
      $('#' + id_name).hide();
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
      $(this.frameClassName + ':hidden').show();
    });
  }

  runExtension() {
    // interface
  }

  initHideAndShow(element, url, index) {
    this.isHide(url).then((isHide) => {
      if(isHide) {
        $(element).hide();
        $(element).css('background-color', this.trashUrlBackgroundColor);
        this.addPickUpTrashButton(element, index);
      } else {
        this.addTrashBoxButton(element, index);
      }
    });
  }
}