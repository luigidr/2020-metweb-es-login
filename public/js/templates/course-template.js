function createCourseTable() {
    return`<table class="table">
        <thead class="thead-light">
            <tr>
                <th>Codice</th>
                <th>Nome</th>
                <th>Crediti</th>
            </tr>
        </thead>
        <tbody id="my-courses">
        </tbody>
    </table>`;
}

function createCourseRow(course) {
    return `<tr>
        <td>${course.code}</td>
        <td>${course.name}</td>
        <td>${course.credits}</td>
    </tr>`;
}

export {createCourseRow, createCourseTable};