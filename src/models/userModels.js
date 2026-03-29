const db = require("../database/db");

function addUser(user, callback) {
    db.query(
        "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
        [user.name, user.username, user.email, user.password],
        function(err, result) {
            callback(err, result);
        }
    );
}

function showUsers(callback) {
    db.query("SELECT id, name, username, email, role FROM users", (err, rows) => {
        callback(err, rows);
    });
}

function showUserById(id, callback) {
    db.query("SELECT id, name, username, email, role FROM users WHERE id = ?", [id], (err, rows) => {
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
        "UPDATE users SET name = ?, username = ?, email = ?, password = ? WHERE id = ?",
        [user.name, user.username, user.email, user.password, id],
        function(err, result) {
            callback(err, result);
        }
    );
}

// Login aceita email OU @username
function authUser(identifier, callback) {
    db.query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [identifier, identifier],
        function(err, result) {
            callback(err, result);
        }
    );
}

function promoteUserAdmin(id, callback) {
    db.query(
        "UPDATE users SET role = 'admin' WHERE id = ?", [id],
        function(err, result) {
            callback(err, result);
        }
    );
}

function revokeUserAdmin(id, callback) {
    db.query(
        "UPDATE users SET role = 'user' WHERE id = ?", [id],
        function(err, result) {
            callback(err, result);
        }
    );
}

module.exports = { addUser, showUsers, showUserById, deleteUser, updateUser, authUser, promoteUserAdmin, revokeUserAdmin };
