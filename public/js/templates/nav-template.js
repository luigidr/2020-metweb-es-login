'use strict';

function createNavLinks(active) {
  return `<li class="nav-item ${active==='courses' ? 'active' : ''}">
    <a class="nav-link" href="/">Corsi ${active==='courses' ? '<span class="sr-only">(current)</span>' : ''}</a>
  </li>
  <li class="nav-item ${active==='exams' ? 'active' : ''}">
    <a class="nav-link" href="/exams">Esami ${active==='exams' ? '<span class="sr-only">(current)</span>' : ''}</a>
  </li>`;
}

export {createNavLinks};