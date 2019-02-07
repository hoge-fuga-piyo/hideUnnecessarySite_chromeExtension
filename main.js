class SearchBase {
  constructor() {
    this.frameClassName = '';
    this.trashBoxButtonIdPrefix = 'trashBox';
    this.pickUpTrashButtonIdPrefix = 'pickUpTrash';
    this.hiddenContentButtonId = 'hiddenContentButton';
    this.trashUrlBackgroundColor = 'lightgrey';
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
    let elements = $(this.frameClassName);
    $(elements[elements.length - 1]).after('<button id=' + this.hiddenContentButtonId + ' type="button">HideContents</button>');
    this.declareHiddenContentButton();
  }

  declareHiddenContentButton() {
    $('#' + this.hiddenContentButtonId).on('click', () => {
      $(this.frameClassName + ':hidden').show();
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
    action_menu.after('<button id=' + id_name + ' type="button">Trash</button>');
    const url = $(element).find('a').attr('href');
    super.declareTrashBoxButton(element, url, index);
  }

  addPickUpTrashButton(element, index) {
    const id_name = this.pickUpTrashButtonIdPrefix + index;
    let action_menu = $(element).find('.action-menu' + '.ab_ctl');
    action_menu.after('<button id=' + id_name + ' type="button">PickUp</button');
    const url = $(element).find('a').attr('href');
    super.declarePickUpTrashButton(element, url, index);
  }
}

let google_search = new GoogleSearch();
let elements = $('.g');
for(let i = 0; i < elements.length; i++) {
  let url = $(elements[i]).find('a').attr('href');

  google_search.isHide(url).then(function(hide){
    if(hide) {
      $(elements[i]).hide();
      $(elements[i]).css('background-color', 'lightgrey');
      google_search.addPickUpTrashButton(elements[i], i+1);
    } else {
      google_search.addTrashBoxButton(elements[i], i+1);
    }
  });
}

google_search.addHiddenContentButton();