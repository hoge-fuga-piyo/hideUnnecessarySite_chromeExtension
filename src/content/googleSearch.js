class GoogleSearch extends SearchBase {
  constructor() {
    super();
    this.frameClassName = '.g';
  }

  addTrashBoxButton(element, index) {
    const id_name = this.trashBoxButtonIdPrefix + index;
    //let action_menu = $(element).find('.action-menu' + '.ab_ctl');
    let action_menu = $(element).find('a:first');
    action_menu.before('<input id=' + id_name + ' type="image" src=' + this.trashBoxInImgPath + ' alt="TrashBox" width="15" height="20">');
    //action_menu.append('<input id=' + id_name + ' type="image" src=' + this.trashBoxInImgPath + ' alt="TrashBox" width="15" height="20">');
    const url = $(element).find('a').attr('href');
    super.declareTrashBoxButton(element, decodeURIComponent(url), index);
  }

  addPickUpTrashButton(element, index) {
    const id_name = this.pickUpTrashButtonIdPrefix + index;
    //let action_menu = $(element).find('.action-menu' + '.ab_ctl');
    let action_menu = $(element).find('a:first');
    action_menu.before('<input id=' + id_name + ' type="image" src=' + this.trashBoxOutImgPath + ' alt="PickUp" width="16" height="20">');
    //action_menu.after('<input id=' + id_name + ' type="image" src=' + this.trashBoxOutImgPath + ' alt="PickUp" width="16" height="20">');
    const url = $(element).find('a').attr('href');
    super.declarePickUpTrashButton(element, decodeURIComponent(url), index);
  }

  addHiddenContentButton() {
    $(()=> {
      let elements = $(this.frameClassName);
      for(let i = elements.length - 1; i >= 0; i--) {
        // 検索結果の右側にスペック情報とかが表示されて意図しない位置に表示されるのを防ぐ
        if(!$(elements[i]).hasClass('rhsvw')) {
          $(elements[i]).after('<div id=' + this.hiddenContentSpaceId + '><input id=' + this.hiddenContentButtonId + ' type="image" src=' + this.trashBoxHideImgPath + ' alt="ShowHiddenContents"></div>');
          let hiddenElementsNum = $(this.frameClassName + ':hidden').length;
          $('#' + this.hiddenContentButtonId).after('<span id=' + this.hiddenContentNumId + '>' + hiddenElementsNum + '</span>');
          this.hiddenContentNum = hiddenElementsNum;
          break;
        }
      }
      this.declareHiddenContentButton();
    });
  }

  runExtension() {
    let elements = $(this.frameClassName);
    for(let i = 0; i < elements.length; i++) {
      const url = $(elements[i]).find('a').attr('href');
      super.initHideAndShow(elements[i], decodeURIComponent(url), i + 1);
    }

    this.addHiddenContentButton();
  }
}
