class GoogleSearch extends SearchBase {
  constructor() {
    super();
    this.frameClassName = '.g';
  }

  addTrashBoxButton(element, index) {
    const id_name = this.trashBoxButtonIdPrefix + index;
    let action_menu = $(element).find('.action-menu' + '.ab_ctl');
    action_menu.after('<input id=' + id_name + ' type="image" src=' + this.trashBoxInImgPath + ' alt="TrashBox" width="14" height="16">');
    const url = $(element).find('a').attr('href');
    super.declareTrashBoxButton(element, decodeURIComponent(url), index);
  }

  addPickUpTrashButton(element, index) {
    const id_name = this.pickUpTrashButtonIdPrefix + index;
    let action_menu = $(element).find('.action-menu' + '.ab_ctl');
    action_menu.after('<input id=' + id_name + ' type="image" src=' + this.trashBoxOutImgPath + ' alt="PickUp" width="14" height="16">');
    const url = $(element).find('a').attr('href');
    super.declarePickUpTrashButton(element, decodeURIComponent(url), index);
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
    let elements = $(this.frameClassName);
    for(let i = elements.length - 1; i >= 0; i--) {
      // 検索結果の右側にスペック情報とかが表示されて意図しない位置に表示されるのを防ぐ
      if(!$(elements[i]).hasClass('rhsvw')) {
        $(elements[i]).after('<div id=' + this.hiddenContentSpaceId + '><input id=' + this.hiddenContentButtonId + ' type="image" src=' + this.trashBoxHideImgPath + ' alt="ShowHiddenContents"></div>');
        setTimeout(() => {
          let hiddenElementsNum = $(this.frameClassName + ':hidden').length;
          $('#' + this.hiddenContentButtonId).after('<span id=' + this.hiddenContentNumId + '>' + hiddenElementsNum + '</span>');
          this.hiddenContentNum = hiddenElementsNum;
        }, 100);
        break;
      }
    }
    this.declareHiddenContentButton();
  }
}
