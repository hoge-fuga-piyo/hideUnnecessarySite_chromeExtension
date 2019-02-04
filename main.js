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
    console.log(id_name);
    console.log(url);
  });
}

let elements = $('.g');
for(let i = 0; i < elements.length; i++) {
  let url = $(elements[i]).find('a').attr('href');
  let hide = false;

  isHide(url).then(function(hide){
    console.log(hide);
    if(hide) {
      $(elements[i]).hide();
    }
  });

  addTrashBoxButton(elements[i], i+1);
}