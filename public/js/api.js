import Exam from './exam.js';

class Api {
    /**
     * Get the list of my exams
     */
    static getPassedExams = async () => {
        let response = await fetch('/api/exams');
        const examsJson = await response.json();
        if (response.ok) {
            return examsJson.map((ex) => Exam.from(ex));
        } else {
            throw examsJson;
        }
    }

    /**
     * Get the list of courses
     */
    static getCourses = async () => {
        let response = await fetch('/api/courses');
        const courseJson = await response.json();
        if (response.ok) {
            return courseJson;
        } else {
            throw courseJson;
        }
    }

    /**
     * Perform the login
     */
    static doLogin = async (username, password) => {
        let response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        if(response.ok) {
            const username = await response.json();
            return username;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch(err) {
                throw err;
            }
        }
    }

    /**
     * Perform the logout
     */
    static doLogout = async () => {
        await fetch('/api/sessions/current', { method: 'DELETE' });
    }
}


export default Api;
