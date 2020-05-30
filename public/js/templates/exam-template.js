function createExamTable() {
    return`<table class="table">
        <thead class="thead-light">
            <tr>
                <th>Data</th>
                <th>Esame</th>
                <th>Voto</th>
            </tr>
        </thead>
        <tbody id="my-exams">
        </tbody>
    </table>`;
}

function createExamRow(exam) {
    return `<tr>
        <td>${exam.date.format('DD/MM/YYYY')}</td>
        <td>${exam.name}</td>
        <td>${exam.score}</td>
    </tr>`;
}

export {createExamRow, createExamTable};