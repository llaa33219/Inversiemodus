// 페이지 로드 시 저장된 값 확인 후, 반전 모드를 적용해 준다.
chrome.storage.sync.get(["inverted"], (data) => {
    if (data.inverted) {
      // 사이트 전체 색반전 적용
      document.documentElement.style.filter = "invert(1)";
    }
  });
  
  // 팝업에서 보낸 메시지를 수신하여 반전 모드를 즉시 적용/해제한다.
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleInvert") {
      if (request.value) {
        document.documentElement.style.filter = "invert(1)";
      } else {
        document.documentElement.style.filter = "";
      }
    }
    sendResponse({ status: "ok" });
  });
  