const { addUser, showUsers, showUserById, deleteUser, updateUser, authUser, promoteUserAdmin, revokeUserAdmin } = require("../models/userModels");

//hash de criptografia
const bcrypt = require("bcryptjs");
const saltRounds = 10;

//web token pra nao logar toda hr
const jwt = require("jsonwebtoken");

function adicionarUser(req, res) {
    const { name, email, password } = req.body;

    if(!email || !email.includes("@")) {
        return res.status(400).json({ message: "Email inválido" });
    }

    if(!password || password.length < 6) {
        return res.status(400).json({ message: "Senha muito curta" });
    }


    //criptografar a senha
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            return res.status(500).json( { message: "Erro ao criptografar senha" });
        }

        const user = {
            name,
            email,
            password: hash
        };

        addUser(user, (err, result) => {
            if (err) {
                console.log("ERRO REAL DO BANCO:", err);
                return res.status(500).json({ message: err.message });
            }
            if(result.affectedRows === 1) {
                return res.status(201).json(
                    {message: "Usuario criado",
                    id: result.insertId
                    });
            } else {
                return res.status(500).json({ message: "Erro ao salvar usuario" });
            }
        });

    });
}

function mostrarUsers(req, res) {
    showUsers((err, rows) => {
        if(err) {
            return res.status(500).json( {message: "Erro ao listar usuarios"} );
        }

        res.json(rows);
    });
}

function mostrarUserId(req, res) {
    const id = req.params.id;
    showUserById(id, (err,rows) => {
        if(err) {
            return res.status(500).json( { message:"Erro ao listar usuario" });
        }
        if(rows.length === 0) {
            return res.status(404).json( { message:"nao ha usuario com esse id" });
        }
        res.json(rows);
    });
}


function deletarUser(req,res) {
    const userId = req.user.id;
    const id = req.params.id;

    if(Number(userId) === Number(id)) {
        return res.status(400).json({
            message: "Você não pode excluir sua própria conta"
        });
    }
    deleteUser(id, (err, result) => {
        if(err) {
            return res.status(500).json({ message: "Erro ao deletar usuarios" });
        }
        if(result.affectedRows === 1) {
            return res.status(200).send(
                {message: "Usuario deletado",
                 id: id
                });
        } else {
            return res.status(404).json({ message: "Erro ao deletar usuario" });
        }
    });
}

function atualizarUser(req, res) {
    const id = req.params.id;
    const { name, email, password } = req.body;

    //criptografar a senha
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            return res.status(500).json( { message: "Erro ao criptografar senha" });
        }

        const user = {
            name,
            email,
            password: hash
        };

        updateUser(id, user, (err, result) => {
        if(err) {
            return res.status(500).json( { message: "Erro ao atualizar usuarios" });
        }
        if(result.affectedRows === 1) {
            return res.status(200).send(
                {message: "Usuario atualizado",
                 id: id
                });
        } else {
            return res.status(404).json( { message: "Erro ao atualizar usuario" });
        }
        });
    });
}

function verificarUser(req, res) {
    const { email, password } = req.body;

    authUser(email, (err, result) => {
        if(err){
            return res.status(500).json({ message: "Erro ao autenticar usuario" });
        }
        if(result.length === 0) {
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }

        const user = result[0]; 

        //comparar a senha criptografada com a senha passada
        bcrypt.compare(password, user.password, (err, samepass) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao verificar senha" });
            }

            if (!samepass) {
                
                return res.status(401).json({ message: "Email ou senha incorretos" });
            }

            //criacao do token
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })

            return res.status(200).json( {
                message: "usuario autenticado",
                token: token,
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        });
    });
}

//logado
function dashboard(req, res) {
    res.json({
        message: "dashboard",
        user: req.user
    });
}

//rota de admin
function adminController(req, res) {
    res.json({
        message: "Área administrativa",
        user: {
            id: req.user.id,
            role: req.user.role
        }
    });
}

//promover usuario a admin
function promoverUser(req,res) {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    promoteUser(id, (err, result) => {
        if(err) {
            return res.status(500).json({ message: "Erro ao promover usuarios" });
        }
        if(result.affectedRows === 1) {
            return res.status(200).send(
                {message: "Usuario promovido",
                 id: id
                });
        } else {
            return res.status(404).json({ message: "Erro ao promover usuario" });
        }
    });
}

//remove role admin do usuario
function revogarUser(req,res) {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    revokeUserAdmin(id, (err, result) => {
        if(err) {
            return res.status(500).json({ message: "Erro ao revogar role" });
        }
        if(result.affectedRows === 1) {
            return res.status(200).send(
                {message: "Usuario revogado",
                 id: id
                });
        } else {
            return res.status(404).json({ message: "Erro ao revogar usuario" });
        }
    });
}

module.exports = { adicionarUser, mostrarUsers, deletarUser, atualizarUser, verificarUser, dashboard, adminController, promoverUser, revogarUser };
