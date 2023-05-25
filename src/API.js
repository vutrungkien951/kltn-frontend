import axios from 'axios'
import cookie from 'react-cookies'

export let endpoints = {
    'categories': '/categories/',
    'login': '/api/login',
    'register': '/api/sign-up',
    'hello-test': '/hello-world',
    'nguoidung': '/api/current-user/',
    'uploadFileJournal': (journalId) => `/api/uploadFileJournal/${journalId}`,
    'uploadFilePeerReview': (peerReviewId) => `/api/uploadFilePeerReview/${peerReviewId}`,
    'submission': '/api/submission',
    'users': '/api/users',
    'users-pagination': (page) => `/api/users-pagination/?page=${page}`,
    'create-user-role': '/api/create-user-role',
    'journal-waiting-handle': '/api/journal-waiting-handle',
    'journal-waiting-handle-pagination': (page) => `/api/journal-waiting-handle-pagination/?page=${page}`,
    'journal-waiting-spec': '/api/journal-waiting-spec',
    'journal-waiting-spec-pagination': (page) => `/api/journal-waiting-spec-pagination/?page=${page}`,
    'journal-waiting-decide': '/api/journal-waiting-decide',
    'journal-waiting-decide-pagination': (page) => `/api/journal-waiting-decide-pagination/?page=${page}`,
    'journal-waiting-decide-after-edit': '/api/journal-waiting-decide-after-edit',
    'journal-waiting-decide-after-edit-pagination': (page) => `/api/journal-waiting-decide-after-edit-pagination/?page=${page}`,
    'journal-waiting-format': '/api/journal-waiting-format',
    'journal-waiting-format-pagination': (page) => `/api/journal-waiting-format-pagination/?page=${page}`,
    'journal-waiting-add-magazine': '/api/journal-waiting-add-magazine',
    'journal-waiting-add-magazine-pagination': (page) => `/api/journal-waiting-add-magazine-pagination/?page=${page}`,
    'accept-journal': '/api/journal/accept-in-table',
    'accept-journal-publish': (journalId) => `/api/journal/accept-publish/${journalId}`,
    'reject-journal': '/api/journal/reject-in-table',
    'reject-journal-publish': (journalId) => `/api/journal/reject-publish/${journalId}`,
    'edit-journal-publish': (journalId) => `/api/journal/edit-before-publish/${journalId}`,
    'submit-edit-journal-publish': (journalId) => `/api/journal/submit-edit-journal-publish/${journalId}`,
    //update format
    'update-format-journal-publish': (journalId) => `/api/journal/update-format-journal-publish/${journalId}`,
    //submit format
    'submit-format-journal-publish': (journalId) => `/api/journal/submit-format-journal-publish/${journalId}`,
    'submit-formatted-journal-publish': (journalId) => `/api/journal/submit-formatted-journal-publish/${journalId}`,
    //after 
    'add-journal-magazine-unpublish': (magazineId) => `/api/journal/add-journal-magazine-unpublish/${magazineId}`,
    "remove-journal-magazine-unpublish" : (magazineId) => `/api/journal/remove-journal-magazine-unpublish/${magazineId}`,
    'publish-journal': '/api/publish-magazine-number',
    'journal-info' : (journalId) => `/api/journal/${journalId}`,
    'list-peer-reviewer': '/api/users/peer-reviewer',
    'create-peer-review': '/api/savePeerReview',
    'journal-waiting-review': '/api/getPeerReviewByReviewer',
    'journal-waiting-review-test': '/api/getPeerReviewByReviewer-test',
    'journal-waiting-review-test-pagination': (page) => `/api/getPeerReviewByReviewer-test-pagination/?page=${page}`,
    'review-journal': (peerReviewId) => `/api/review-journal/${peerReviewId}`,    
    'list-magazine-unpublished': '/api/get-magazine-number-unpublished',
    'list-magazine-published': '/api/get-magazine-number-published',
    'create-magazine': '/api/create-magazine-number',
    'get-user-info-by-id': (userId) => `/api/get-user-by-id/${userId}`,
    'my-journal': '/api/author-journal',
    'my-journal-pagination': (page) => `/api/author-journal-pagination?page=${page}`,
    "update-password": "/api/updatePassword",
    //magazine released
    'magazine-released': '/api/get-magazine-number-released',
    'magazine-released-pagination' : (page) => `/api/get-magazine-number-released-pagination?page=${page}`,
    'check-username-exists': '/api/checkUsernameExist',
    "send-invitation": "/api/verification_token",
    //comment-rating
    "comment": "/api/comment",
    "rating": "/api/rating",
    "avg-rating": (journalId) => `/api/ratingAvg/${journalId}`,
    "count-rating" : (journalId) => `/api/countRating/${journalId}`,
    "delete-comment" : (commentId) => `/api/delete-comment/${commentId}`
}

export const authAxios = () => axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Authorization": `Bearer ${cookie.load('access_token')}`
    }
})

export default axios.create({
    baseURL: "http://localhost:8080"
})