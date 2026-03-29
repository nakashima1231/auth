const db = require("../database/db");

function addUser(user, callback) {
    db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [user.name, user.email, user.password],
        function(err, result) {
            callback(err, result);
        }
    );
}

function showUsers(callback) {
    db.query("SELECT * FROM users", (err, rows) => {
        callback(err, rows);
    });
}

function showUserById(id, callback) {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
        callback(err, rows);
    });
}

function deleteUser(id, callback) {
    db.query("DELETE FROM users WHERE id = ?", [id],
         function(err, result) {
            callback(err, result);
        }
    );
}

function updateUser(id, user, callback) {
    db.query(
    "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", 
    [user.name, user.email, user.password, id],
        function(err, result) {
            callback(err, result);
        }
    );
}
    
//login
function authUser(email, callback) {
    db.query(
    "SELECT * FROM users WHERE email = ?", 
    [email],
        function(err, result) {
            callback(err, result);
        }
    );
}

//promover a admin
function promoteUserAdmin(id, callback) {
    db.query(
        "UPDATE users SET role = 'admin' WHERE id = ?", [id],
        function(err, result) {
            callback(err, result);
        }
    );
}

//remove a role de admin
function revokeUserAdmin(id, callback) {
    db.query(
        "UPDATE users SET role = 'user' WHERE id = ?", [id],
        function(err, result) {
            callback(err, result);
        }
    );
}



module.exports = { addUser, showUsers, showUserById, deleteUser, updateUser, authUser, promoteUserAdmin, revokeUserAdmin };
