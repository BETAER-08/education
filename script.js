// script.js
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

    // 모바일에서 꾹 누르면 삭제
    alphabetList.addEventListener('touchstart', (event) => {
        if (event.target.tagName === 'SPAN') {
            event.target.dataset.longpress = true;
            setTimeout(() => {
                if (event.target.dataset.longpress) {
                    const confirmation = confirm("이 단어를 삭제하시겠습니까?");
                    if (confirmation) {
                        const div = event.target.closest('div');
                        const letter = div.getAttribute('data-letter');
                        const words = wordsByAlphabet[letter];
                        const wordToRemove = event.target.textContent.split(', ').find(word => event.target.textContent.includes(word));
                        const wordIndex = words.findIndex(word => word === wordToRemove);
                        if (wordIndex !== -1) {
                            words.splice(wordIndex, 1); // 해당 단어 삭제
                            if (words.length === 0) {
                                delete wordsByAlphabet[letter]; // 알파벳이 빈 경우 삭제
                            }
                            updateAlphabetList();
                        }
                    }
                }
            }, 1000); // 500ms 후 삭제 확인
        }
    });

    alphabetList.addEventListener('touchend', (event) => {
        if (event.target.tagName === 'SPAN') {
            event.target.dataset.longpress = false;
        }
    });

    updateAlphabetList(); // 초기화시 리스트 업데이트
});
