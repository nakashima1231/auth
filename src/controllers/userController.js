const { addUser, showUsers, showUserById, deleteUser, updateUser, authUser, promoteUserAdmin, revokeUserAdmin } = require("../models/userModels");

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

function adicionarUser(req, res) {
    const { name, username, email, password } = req.body;

    if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Email inválido" });
    }

    if (!username || username.length < 3) {
        return res.status(400).json({ message: "Username deve ter pelo menos 3 caracteres" });
    }

    // username só pode ter letras, números e _
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ message: "Username só pode conter letras, números e _" });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ message: "Senha muito curta" });
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.status(500).json({ message: "Erro ao criptografar senha" });

        const user = { name, username: username.toLowerCase(), email, password: hash };

        addUser(user, (err, result) => {
            if (err) {
                console.log("ERRO REAL DO BANCO:", err);
                return res.status(500).json({ message: err.message });
            }
            if (result.affectedRows === 1) {
                return res.status(201).json({ message: "Usuario criado", id: result.insertId });
            } else {
                return res.status(500).json({ message: "Erro ao salvar usuario" });
            }
        });
    });
}

function mostrarUsers(req, res) {
    showUsers((err, rows) => {
        if (err) return res.status(500).json({ message: "Erro ao listar usuarios" });
        res.json(rows);
    });
}

function mostrarUserId(req, res) {
    const id = req.params.id;
    showUserById(id, (err, rows) => {
        if (err) return res.status(500).json({ message: "Erro ao listar usuario" });
        if (rows.length === 0) return res.status(404).json({ message: "Nao ha usuario com esse id" });
        res.json(rows);
    });
}

function deletarUser(req, res) {
    const userId = req.user.id;
    const id = req.params.id;

    if (Number(userId) === Number(id)) {
        return res.status(400).json({ message: "Você não pode excluir sua própria conta" });
    }

    deleteUser(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao deletar usuario" });
        if (result.affectedRows === 1) {
            return res.status(200).json({ message: "Usuario deletado", id });
        } else {
            return res.status(404).json({ message: "Erro ao deletar usuario" });
        }
    });
}

function atualizarUser(req, res) {
    const id = req.params.id;
    const { name, username, email, password } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.status(500).json({ message: "Erro ao criptografar senha" });

        const user = { name, username: username.toLowerCase(), email, password: hash };

        updateUser(id, user, (err, result) => {
            if (err) return res.status(500).json({ message: "Erro ao atualizar usuario" });
            if (result.affectedRows === 1) {
                return res.status(200).json({ message: "Usuario atualizado", id });
            } else {
                return res.status(404).json({ message: "Erro ao atualizar usuario" });
            }
        });
    });
}

function verificarUser(req, res) {
    // aceita tanto email quanto username no campo "identifier"
    const { identifier, password } = req.body;

    if (!identifier) {
        return res.status(400).json({ message: "Email ou username obrigatório" });
    }

    authUser(identifier, (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao autenticar usuario" });
        if (result.length === 0) return res.status(401).json({ message: "Credenciais incorretas" });

        const user = result[0];

        bcrypt.compare(password, user.password, (err, samepass) => {
            if (err) return res.status(500).json({ message: "Erro ao verificar senha" });
            if (!samepass) return res.status(401).json({ message: "Credenciais incorretas" });

            // username incluído no token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                message: "usuario autenticado",
                token,
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role
            });
        });
    });
}

function dashboard(req, res) {
    res.json({ message: "dashboard", user: req.user });
}

function adminController(req, res) {
    res.json({
        message: "Área administrativa",
        user: { id: req.user.id, role: req.user.role }
    });
}

function promoverUser(req, res) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "ID inválido" });

    promoteUserAdmin(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao promover usuario" });
        if (result.affectedRows === 1) {
            return res.status(200).json({ message: "Usuario promovido", id });
        } else {
            return res.status(404).json({ message: "Erro ao promover usuario" });
        }
    });
}

function revogarUser(req, res) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "ID inválido" });

    revokeUserAdmin(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao revogar role" });
        if (result.affectedRows === 1) {
            return res.status(200).json({ message: "Usuario revogado", id });
        } else {
            return res.status(404).json({ message: "Erro ao revogar usuario" });
        }
    });
}

module.exports = { adicionarUser, mostrarUsers, mostrarUserId, deletarUser, atualizarUser, verificarUser, dashboard, adminController, promoverUser, revogarUser };
