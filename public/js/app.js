import Api from './api.js';
import {createExamRow, createExamTable} from './templates/exam-template.js';
import {createCourseRow, createCourseTable} from './templates/course-template.js';
import {createNavLinks} from './templates/nav-template.js';
import {createLoginForm} from './templates/login-template.js';
import {createAlert} from './templates/alert-template.js';
import page from '//unpkg.com/page/page.mjs';

class App {

    constructor(appContainer, navLinks) {
        // references to needed HTML elements
        this.appContainer = appContainer;
        this.navLinks = navLinks;
        this.logoutLink = document.querySelector('#logout');
        
        // routing
        page('/login', () => {
            this.navLinks.innerHTML = '';
            this.appContainer.innerHTML = createLoginForm();
            document.getElementById('login-form').addEventListener('submit', this.onLoginSubmitted);
        });
        page('/exams', this.showExams);
        page('/logout', this.logout);
        page('/', this.showCourses);
        // very simple example of how to handle a 404 Page Not Found 
        // page('*', () => this.appContainer.innerHTML = 'Page not found!');
        page();
    }

    /**
     * Create the HTML table for showing the exams
     */
    showExams = async () => {
        try {
            const exams = await Api.getPassedExams();
            
            this.renderNavBar('exams');

            this.appContainer.innerHTML = createExamTable();
            const examTable = document.querySelector('#my-exams');

            for(let exam of exams) {
                const examRow = createExamRow(exam);
                examTable.insertAdjacentHTML('beforeend', examRow);
            }
        } catch(error) {
            page.redirect('/login');
        }
    }

    /**
     * Create the HTML table for showing the courses
     */
    showCourses = async () => {
        try {
            const courses = await Api.getCourses();
            
            this.renderNavBar('courses');

            this.appContainer.innerHTML = createCourseTable();
            const courseTable = document.querySelector('#my-courses');

            for(let course of courses) {
                const courseRow = createCourseRow(course);
                courseTable.insertAdjacentHTML('beforeend', courseRow);
            }
        } catch(error) {
            page.redirect('/login');
        }
    }

    /**
     * Render the navbar and show the logout link
     */
    renderNavBar = (active) => {
        this.navLinks.innerHTML = '';
        this.navLinks.insertAdjacentHTML('beforeend', createNavLinks(active));
        this.logoutLink.classList.remove('invisible');
    };

    /**
     * Perform the logout
     */
    logout = async () => {
        await Api.doLogout();
        this.logoutLink.classList.add('invisible');
        page.redirect('/login');
    }

    /**
     * Event listener for the submission of the login form. Handle the login.
     * @param {*} event 
     */
    onLoginSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        const alertMessage = document.getElementById('alert-message');

        if(form.checkValidity()) {
            try {
                const user = await Api.doLogin(form.email.value, form.password.value);
                this.logoutLink.classList.remove('invisible');
                // welcome the user
                alertMessage.innerHTML = createAlert('success', `Welcome ${user}!`);
                // automatically remove the flash message after 3 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);

                page.redirect('/');
            } catch(error) {
                if (error) {
                    const errorMsg = error;
                    // add an alert message in DOM
                    alertMessage.innerHTML = createAlert('danger', errorMsg);
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 3000);
                }
            }
        }
    }
}

export default App;
