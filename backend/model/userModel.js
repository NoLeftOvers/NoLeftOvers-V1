const pool = require('../db');

// 새로운 유저 생성
const createUser = ({ name, nickName, schoolNumber, password }) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user (name, nickName, school_number, password) VALUES (?, ?, ?, ?)';
        pool.query(sql, [name, nickName, schoolNumber, password], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const findUserBySchoolNumber = (schoolNumber) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE school_number = ?';
        pool.query(sql, [schoolNumber], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]); // 결과가 배열로 반환되므로 첫 번째 요소만 반환
        });
    });
};

module.exports = {
    createUser,
    findUserBySchoolNumber,
};
