    const express = require("express");
    const router = express.Router();
    const { adicionarUser, mostrarUsers, deletarUser, atualizarUser, verificarUser, dashboard, adminController, promoverUser, revogarUser  } = require("../controllers/userController");

    //verificacao de rota
    const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");


    //login
    router.post("/login", verificarUser);

    //registrar
    router.post("/register", adicionarUser);

    //mostrar usuarios
    router.get("/users",authMiddleware, mostrarUsers);

    //deletar usuario
    router.delete("/users/:id",authMiddleware, isAdmin, deletarUser);

    //atualizar usuario
    router.put("/users/:id", authMiddleware, isAdmin, atualizarUser);

    //perfil do usuario
    router.get("/dashboard", authMiddleware, dashboard);

    //rota de admin
    router.get("/admin", authMiddleware, isAdmin, adminController);

    //promover usuario pra admin
    router.patch("/admin/:id/promote", authMiddleware, isAdmin, promoverUser);

    //remover admin de usuario
    router.patch("/admin/:id/revoke", authMiddleware, isAdmin, revogarUser);

    module.exports = router;
