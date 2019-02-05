function isHide(url) {
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

function addTrashBoxButton(element, index) {
  // ゴミ箱ボタンを作成
  let id_name = 'trashBox' + index;
  let action_menu = $(element).find('.action-menu' + '.ab_ctl');
  action_menu.after('<button id=' + id_name + ' type="button">Trash</button>');

  // ゴミ箱ボタンの動作を定義
  $('#' + id_name).on('click', function() {
    let url = $(element).find('a').attr('href');
    chrome.storage.local.set({[url] : true}, function(){
    });
    $(element).hide();
    $(element).css('background-color', 'lightgrey');
    $('#' + id_name).hide();
    addPickUpTrashButton(element, index);
  });
}

function addPickUpTrashButton(element, index) {
  let id_name = 'pickUpTrash' + index;
  let action_menu = $(element).find('.action-menu' + '.ab_ctl');
  action_menu.after('<button id=' + id_name + ' type="button">PickUp</button');

  $('#' + id_name).on('click', function() {
    let url = $(element).find('a').attr('href');
    chrome.storage.local.remove(url, function() {
    });
    $(element).show();
    $(element).css('background-color', '');
    $('#' + id_name).hide();
    addTrashBoxButton(element, index);
  });
}

function addHiddenContentButton() {
  // 非表示サイトを表示するボタンを作成
  let elements = $('.g');
  $(elements[elements.length - 1]).after('<button id="hiddenContentButton" type="button">HideContents</button>');

  // 表示ボタンの動作を定義
  $('#hiddenContentButton').on('click', function() {
    $('.g:hidden').show();
  })
}

let elements = $('.g');
for(let i = 0; i < elements.length; i++) {
  let url = $(elements[i]).find('a').attr('href');

  isHide(url).then(function(hide){
    if(hide) {
      $(elements[i]).hide();
      $(elements[i]).css('background-color', 'lightgrey');
      addPickUpTrashButton(elements[i], i+1);
    } else {
      addTrashBoxButton(elements[i], i+1);

    }
  });
}

addHiddenContentButton();