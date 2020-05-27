const bcrypt = require('bcrypt');
const sqlite = require('sqlite3');

const db = new sqlite.Database('exams.db', (err) => {
  if (err) throw err;
});

exports.getAllCourses = function(){
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const courses = rows.map((e) => ({code: e.code, name: e.name, credits: e.CFU}));
      resolve(courses);
    });
  });
};

exports.getAllExams = function(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT course_code, score, date, name, id, user_id FROM exam, course WHERE course_code=code AND user_id=?';

    // execute the query and get all the results into 'rows'
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      // transform 'rows' (query results) into an array of objects
      const exams = rows.map((e) => (
        {
          code: e.course_code,
          score: e.score,
          date: e.date,
          name: e.name,
          id: e.id,
        }
      ));
      resolve(exams);
    });
  });
};

exports.getUserById = function(id) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE id = ?';
      db.get(sql, [id], (err, row) => {
          if (err) 
              reject(err);
          else if (row === undefined)
              resolve({error: 'User not found.'});
          else {
              const user = {id: row.id, username: row.email}
              resolve(user);
          }
      });
  });
};

exports.getUser = function(email, password) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE email = ?';
      db.get(sql, [email], (err, row) => {
          if (err) 
              reject(err);
          else if (row === undefined)
              resolve({error: 'User not found.'});
          else {
            const user = {id: row.id, username: row.email};
            let check = false;
            
            if(bcrypt.compareSync(password, row.password))
              check = true;

            resolve({user, check});
          }
      });
  });
};