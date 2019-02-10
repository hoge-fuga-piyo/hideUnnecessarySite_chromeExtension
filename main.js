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

class GoogleSearch extends SearchBase {
  constructor() {
    super();
    this.frameClassName = '.g';
  }

  addTrashBoxButton(element, index) {
    const id_name = this.trashBoxButtonIdPrefix + index;
    let action_menu = $(element).find('.action-menu' + '.ab_ctl');
    action_menu.after('<input id=' + id_name + ' type="image" src=' + this.trashBoxInImgPath + ' alt="TrashBox">');
    const url = $(element).find('a').attr('href');
    super.declareTrashBoxButton(element, url, index);
  }

  addPickUpTrashButton(element, index) {
    const id_name = this.pickUpTrashButtonIdPrefix + index;
    let action_menu = $(element).find('.action-menu' + '.ab_ctl');
    action_menu.after('<input id=' + id_name + ' type="image" src=' + this.trashBoxOutImgPath + ' alt="PickUp">');
    const url = $(element).find('a').attr('href');
    super.declarePickUpTrashButton(element, url, index);
  }

  runExtension() {
    let elements = $(this.frameClassName);
    for(let i = 0; i < elements.length; i++) {
      const url = $(elements[i]).find('a').attr('href');
      super.initHideAndShow(elements[i], url, i + 1);
    }

    this.addHiddenContentButton();
  }

  addHiddenContentButton() {
    let hiddenElementsNum = $(this.frameClassName + ':hidden').length;
    console.log(hiddenElementsNum);
    let elements = $(this.frameClassName);
    for(let i = elements.length - 1; i>=0; i--) {
      // 検索結果の右側にスペック情報とかが表示されて意図しない位置に表示されるのを防ぐ
      if(!$(elements[i]).hasClass('rhsvw')) {
        $(elements[i]).after('<input id=' + this.hiddenContentButtonId + ' type="image" src=' + this.trashBoxImgPath + ' alt="ShowHiddenContents">' + hiddenElementsNum);
        break;
      }
    }
    this.declareHiddenContentButton();
  }
}

let google_search = new GoogleSearch();
google_search.runExtension();