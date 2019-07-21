import api from './api.js';
(function () {
    const bookContainer = document.querySelector('#book-container');
    const ol = document.querySelector('#chapters-list');
    const route = window.location.pathname;
    const bookId = route.split('/book/')[1];
    
    function showChapterDetails({chapterDetails, chapterId}) {
        const chapterContainer = document.querySelector(`#chapter-${chapterId}`);
        const lessensList = document.createElement('ul');
        lessensList.setAttribute('class', 'chapter-details');
        chapterDetails.forEach(chapter => {
            if (chapter.type === "lesson") {
                const li = document.createElement('li');
                li.setAttribute('class', `lesson ${chapter.status.toLowerCase()}`);
                const span = document.createElement('span');
                const text = document.createTextNode(chapter.title);
                span.appendChild(text);
                li.appendChild(span);
                lessensList.appendChild(li);
            }
        });
        chapterContainer.appendChild(lessensList);
    }

    async function getAndShowChapterDetails(id, chapter) {
        try {
            const loading = chapter.querySelector('.loading');
            loading.classList.remove('hidden')
            const chapterId = id.split('-')[1];
            const chapterDetails = await api.getChapterDetails({bookId, chapterId});
            showChapterDetails({chapterDetails, chapterId});
            loading.classList.add('hidden');
        } catch(err) {
            loading.classList.add('hidden');
            showError(err);
        }
        
    }

    function onChapterSelect(ev) {
        const chapter = ev.currentTarget;
        const chapterDetails = chapter.querySelector('.chapter-details');
       
        if(!chapterDetails) {
            const id = chapter.id;
            getAndShowChapterDetails(id, chapter);
        } else {
            if (chapterDetails.classList.contains('hidden')){
                chapterDetails.classList.remove('hidden');
                chapterDetails.classList.add('show');
            } else {
                chapterDetails.classList.add('hidden');
                chapterDetails.classList.remove('show');
            }
        }       
    }

    function setEvents() {
        const listItems = document.querySelectorAll('#chapters-list .chapter');
        listItems.forEach(chapter => {
            chapter.addEventListener('click', onChapterSelect);
        });
    }

    async function showBookDetails(bookId) {
        try {
            const bookDetails = await api.getBookDetails(bookId);
            bookDetails.forEach(item => {
                if (item.type === "chapter") {
                    const li = document.createElement('li');
                    const chapterContainer = document.createElement('div');
                    chapterContainer.setAttribute('class', 'chapter');
                    chapterContainer.setAttribute('id', `chapter-${item.id}`);
                    const div = document.createElement('div');
                    div.setAttribute('class', 'chapter-title');
                    const text = document.createTextNode(item.title);
                    div.appendChild(text);
                    addProgressBar({div, ...item});
                    chapterContainer.appendChild(div);
                    li.appendChild(chapterContainer);
                    ol.appendChild(li);
                }   
            });
            bookContainer.appendChild(ol);
            setEvents();
        } catch(err) {
            showError(err);
        }
       
    }
    function addProgressBar({div, childrenCount, completeCount}) {
        const percent = (completeCount/childrenCount) * 100;
        const progressBar = document.createElement('div');
        div.setAttribute('title', `Total: ${childrenCount}, Completed: ${completeCount}`);
        progressBar.setAttribute('class', 'progress total');
        progressBar.style.backgroundColor = '#efefef';
        progressBar.style.height = '8px';
        progressBar.style.display = "inline-block";
        progressBar.style.width = "300px";
        progressBar.style.marginLeft = "40px";
        const completed = document.createElement('div');
        completed.setAttribute('class', 'progress completed')
        completed.style.width=`${percent}%`;
        completed.style.height = "100%";
        completed.style.backgroundColor = 'green';
        progressBar.appendChild(completed);
        div.appendChild(progressBar);
        const loading = document.createElement('span');
        loading.classList.add('loading', 'hidden');
        div.appendChild(loading);
    }
    
    function showError(err) {
        const container = document.querySelector('.error-container');
        container.classList.remove('hidden');
        const error = document.createElement('div');
        error.classList.add('error');
        const msg = document.createTextNode(err.message);
        error.appendChild(msg);
        container.appendChild(error);
    }

    document.addEventListener('DOMContentLoaded', event => {
        showBookDetails(bookId);
    });
})();