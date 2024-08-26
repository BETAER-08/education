document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const saveButton = document.getElementById('saveButton');
    const resetButton = document.getElementById('resetButton');
    const alphabetList = document.getElementById('alphabetList');

    // 알파벳 초기화
    const wordsByAlphabet = {};
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        wordsByAlphabet[letter] = [];
    }

    // 영단어 저장 함수
    function saveWord() {
        const word = wordInput.value.trim().toLowerCase();

        // 입력 유효성 검사: 영어만 허용
        const isValid = /^[a-zA-Z]+$/.test(word);
        if (!isValid) {
            alert("영어 단어만 입력 가능합니다. 다시 입력해주세요.");
            wordInput.value = ''; // 입력창 비우기
            return;
        }

        if (word) {
            const firstLetter = word[0].toUpperCase();
            if (wordsByAlphabet[firstLetter]) {
                // 단어가 이미 있는지 확인하여 콤마로 구분하여 추가
                const existingWords = wordsByAlphabet[firstLetter];
                if (existingWords.length > 0 && existingWords[existingWords.length - 1].includes(word)) {
                    existingWords[existingWords.length - 1] += `, ${word}`;
                } else {
                    existingWords.push(word);
                }
                wordsByAlphabet[firstLetter] = existingWords;
                updateAlphabetList();
            }
            wordInput.value = ''; // 입력창 비우기
        }
    }

    // 저장 버튼 클릭 이벤트
    saveButton.addEventListener('click', saveWord);

    // 입력창에서 엔터키 입력 시 저장 기능
    wordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            saveWord();
        }
    });

    // 초기화 버튼 클릭 이벤트
    resetButton.addEventListener('click', () => {
        if (confirm("모든 영단어를 삭제하시겠습니까?")) {
            for (let letter in wordsByAlphabet) {
                wordsByAlphabet[letter] = [];
            }
            updateAlphabetList();
        }
    });

    // 알파벳 목록 업데이트
    function updateAlphabetList() {
        alphabetList.innerHTML = '';
        for (const [letter, words] of Object.entries(wordsByAlphabet)) {
            if (words.length > 0) {
                const wordItems = words.join(', '); // 단어를 콤마로 구분하여 표시
                alphabetList.innerHTML += `
                    <div data-letter="${letter}">
                        <strong>${letter}:</strong>
                        <span>${wordItems}</span>
                    </div>
                `;
            }
        }
    }

    // 단어 클릭 시 링크로 이동
    alphabetList.addEventListener('click', (event) => {
        if (event.target.tagName === 'SPAN') {
            const clickedWord = event.target.textContent.split(', ').find(word => event.target.textContent.includes(word));
            if (clickedWord) {
                const confirmation = confirm(`사전에서 "${clickedWord}"을(를) 검색하시겠습니까?`);
                if (confirmation) {
                    window.open(`https://en.dict.naver.com/#/search?query=${clickedWord}`, '_blank');
                }
            }
        }
    });

    // 우클릭으로 단어 삭제 기능 추가
    alphabetList.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // 기본 컨텍스트 메뉴 방지
        if (event.target.tagName === 'SPAN') {
            const div = event.target.closest('div');
            const letter = div.getAttribute('data-letter');
            const words = wordsByAlphabet[letter];
            const wordIndex = words.findIndex(word => event.target.textContent.includes(word));
            if (wordIndex !== -1) {
                if (confirm('이 단어를 삭제하시겠습니까?')) {
                    words.splice(wordIndex, 1); // 해당 단어 삭제
                    if (words.length === 0) {
                        delete wordsByAlphabet[letter]; // 알파벳이 빈 경우 삭제
                    }
                    updateAlphabetList();
                }
            }
        }
    });

    // 모바일 터치 제스처 처리
    let touchStartTime = 0;
    let touchElement = null;

    alphabetList.addEventListener('touchstart', (event) => {
        touchStartTime = new Date().getTime();
        touchElement = event.target;
    });

    alphabetList.addEventListener('touchend', (event) => {
        const touchEndTime = new Date().getTime();
        const touchDuration = touchEndTime - touchStartTime;

        if (touchElement === event.target) {
            if (touchDuration >= 3000) {
                // 3초 이상 터치 시 단어 삭제
                if (event.target.tagName === 'SPAN') {
                    const div = event.target.closest('div');
                    const letter = div.getAttribute('data-letter');
                    const words = wordsByAlphabet[letter];
                    const wordIndex = words.findIndex(word => event.target.textContent.includes(word));
                    if (wordIndex !== -1) {
                        if (confirm('이 단어를 삭제하시겠습니까?')) {
                            words.splice(wordIndex, 1); // 해당 단어 삭제
                            if (words.length === 0) {
                                delete wordsByAlphabet[letter]; // 알파벳이 빈 경우 삭제
                            }
                            updateAlphabetList();
                        }
                    }
                }
            } else {
                // 짧은 터치 시 단어 검색
                if (event.target.tagName === 'SPAN') {
                    const word = event.target.textContent.trim();
                    if (confirm('영단어 사전으로 이동하시겠습니까?')) {
                        window.open(`https://en.dict.naver.com/#/search?query=${encodeURIComponent(word)}`, '_blank');
                    }
                }
            }
        }
    });

    alphabetList.addEventListener('touchcancel', () => {
        touchStartTime = 0;
        touchElement = null;
    });

    updateAlphabetList(); // 초기화 시 리스트 업데이트
});
