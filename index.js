export default function customCaret() {
  const settings = {
    caretClass: 'caret',
  };
  function getCaretPosition(element) {
    let caretPosition = 0;
    const doc = element.ownerDocument || element.document;
    const win = doc.defaultView || doc.parentWindow;
    let sel;

    if (typeof win.getSelection != 'undefined') {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        const range = win.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretPosition = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != 'Control') {
      const textRange = sel.createRange();
      const preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      caretPosition = preCaretTextRange.text.length;
    }
    return caretPosition;
  }
  function setCaret(element) {
    const caret = `<span class="${settings.caretClass}"></span>`;
    const sel = window.getSelection();
    if (sel.toString() != '') {
      return;
    }

    const caretPosition = getCaretPosition(element);
    const content = element.textContent;
    const output =
      content.substr(0, caretPosition) + caret + content.substr(caretPosition);
    element.innerHTML = output;

    const range = document.createRange();
    range.setStart(element.childNodes[0], caretPosition);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  return function(element) {
    element.addEventListener('keydown', ({ target }) => {
      setCaret(target);
    });
    element.addEventListener('keyup', ({ target }) => {
      setCaret(target);
    });
    element.addEventListener('click', ({ target }) => {
      setCaret(target);
    });
    element.addEventListener('focus', ({ target }) => {
      setCaret(target);
    });
  };
}
