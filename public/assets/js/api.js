const baseUrl = "/api/book/";
function getData(url) {
    return fetch(url).then( (res) => res.json()).then(res => {
        if (res.statusCode === 200) {
            return res.response;
        } else {
            throw new Error(res.response.message);
        }
    }) ;
}
async function getBookDetails(bookId){
    const url = `${baseUrl}${bookId}`;
    const bookDetails = await getData(url);
    bookDetails.sort((a,b) => a.sequenceNO - b.sequenceNO);
    return bookDetails;
}
async function getChapterDetails({bookId, chapterId}) {
    const url = `${baseUrl}${bookId}/section/${chapterId}`;
    const chapterDetails = await getData(url);
    chapterDetails[chapterId].sort((a,b) => a.sequenceNO - b.sequenceNO);
    return chapterDetails[chapterId];
}
export default { getBookDetails, getChapterDetails};