document.addEventListener("DOMContentLoaded", () => {
  const invertToggle = document.getElementById("invertToggle");

  // 1) 스토리지에서 inverted 상태를 읽어와 체크박스와 body 클래스에 반영
  chrome.storage.sync.get(["inverted"], (data) => {
    invertToggle.checked = !!data.inverted;
    if (data.inverted) {
      document.body.classList.add("inverted");
    } else {
      document.body.classList.remove("inverted");
    }
  });

  // 2) 체크박스가 바뀔 때
  invertToggle.addEventListener("change", () => {
    const isChecked = invertToggle.checked;

    // 팝업 자체 배경 전환
    if (isChecked) {
      document.body.classList.add("inverted");
    } else {
      document.body.classList.remove("inverted");
    }

    // 스토리지에 저장
    chrome.storage.sync.set({ inverted: isChecked }, () => {
      // === 추가된 부분: 탭 URL 검사 후, playentry.org 혹은 space.playentry.org일 때만 메시지 전송 ===
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs && tabs.length ? tabs[0] : null;
        if (!currentTab || !currentTab.url) {
          return; // 탭 정보가 없으면 종료
        }

        // URL이 우리가 원하는 도메인이 아니면 메시지 전송 X
        const url = currentTab.url;
        if (
          !url.includes("playentry.org") &&
          !url.includes("space.playentry.org")
        ) {
          // 필요하다면 alert 또는 console.log로 안내 가능
          return;
        }

        // 정상 도메인이면 content script로 메시지 보냄
        chrome.tabs.sendMessage(currentTab.id, {
          action: "toggleInvert",
          value: isChecked
        });
      });
    });
  });
});
