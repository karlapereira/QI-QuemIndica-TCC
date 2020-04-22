const express = require('express');
const router = express.Router();

const db = require('../config/database');
const formattedDate = require('../utils/date');

//Método para pegar todos os grupos dos quais um usuário é membro
router.get('/:idU/:pag', (req,res,next)=>{
    let idU = parseInt(req.params.idU);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (user:User)-[rel:CREATED | :IS_MEMBER]->(group:Group)
                WHERE id(user) = ${idU}
                RETURN group,rel  SKIP ${pagina} LIMIT 5`;

    db(query,res);
});

//Método para pegar a relação entre um grupo e um usuário
router.get('/get/relation/type/:idU/:idG',(req,res,next)=>{
    let idU= parseInt(req.params.idU);
    let idG= parseInt(req.params.idG);

    let query = `MATCH (user:User)-[rel]-(group:Group)
                 WHERE id(user)= ${idU} and id(group)=${idG}
                 RETURN rel`;
    db(query,res)
});

//Retorna o Criador do grupo junto com os detalhes do grupo
router.get('/get/group/creator/:id',(req,res,next)=>{
    let idG = parseInt(req.params.id);
     let query = `MATCH (user:User)-[rel:CREATED]->(group:Group)
     WHERE id(group)=${idG}
     RETURN user,rel,group`; 
     db(query,res)
});

//Retorna o número de membros de um grupo
router.get('/get/members/number/:id', (req,res,next)=>{
    let idG=parseInt(req.params.id);
    let query = `MATCH (user:User)-[rel:CREATED | :IS_MEMBER]->(group:Group)  
                        WHERE id(group) = ${idG} 
                        RETURN  COUNT(rel) as members`;
    db(query,res);
});

// Método para voltar todos os membros de um grupo
router.get('/members/:idG/:pag',(req,res,next)=>{
    let idG = parseInt(req.params.idG);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (user:User)-[rel:CREATED | :IS_MEMBER]->(group:Group)
                 WHERE id(group) = ${idG}
                 RETURN user,rel SKIP ${pagina} LIMIT 5`;
    db(query,res)
});

//Método para ver todos os pedidos de participação feitos para um grupo
router.get('/ask_membership/:idG/:pag', (req,res,next) =>{
    let idG = parseInt(req.params.idG);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (user:User)-[rel:ASKED_MEMBERSHIP]->(group:Group)
                 WHERE id(group) = ${idG} 
                 RETURN user,rel SKIP ${pagina} LIMIT 5`;
    db(query,res);
});

//Método responsável por listar todos os convites recebidos por um usuário 
router.get('/invite/:idU/:pag', (req,res,next) =>{
    let idU = parseInt(req.params.idU);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (group:Group)-[inv:INVITED]->(user:User) 
                WHERE id(user) = ${idU} 
                RETURN group,inv SKIP ${pagina} LIMIT 5`;

    db(query,res);
});

//Método que retorna todos os pedidos enviados por um usuário
router.get('/sent/:idU/:pag', (req,res,next)=>{
    let idU = parseInt(req.params.idU);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (group:Group)<-[asked:ASKED_MEMBERSHIP]-(user:User) 
                WHERE id(user) = ${idU} 
                RETURN group,asked SKIP ${pagina} LIMIT 5`;

    db(query,res);
});

//Método Responsável por criar um grupo
router.post( '/:idU' , (req,res,next) => {
    let name = req.body.nome;
    let description = req.body.descricao;
    let area = req.body.area;
    let idCreator = parseInt(req.params.idU);
    let date = formattedDate();

    let query = `MATCH (creator:User) 
                WHERE id(creator) = ${idCreator} 
                CREATE (creator)-[rel:CREATED{data:"${date}"}]->(group:Group{nome:"${name}",descricao:"${description}",area:"${area}"})
                RETURN creator,rel,group`;
    db(query,res);

});

//Método para convidar uma pessoa no grupo 
router.post('/invite/:idG/:idI', (req,res,next) =>{
    let idG = parseInt(req.params.idG);
    let idI = parseInt(req.params.idI);

    let query = `MATCH (group:Group), (user:User)
                 WHERE id(group) = ${idG} AND id(user)= ${idI} 
                 CREATE (group)-[rel:INVITED{date:"${formattedDate()}"}]->(user)
                 RETURN rel`;

    db(query,res);
});

 
// Método para pedir para participar de um grupo 
router.post('/ask_membership/:idG/:idU',(req,res,next) =>{
    let idG = parseInt(req.params.idG);
    let idU = parseInt(req.params.idU);

    let query  = `MATCH (group:Group),(user:User)
                  WHERE id(group) = ${idG} AND id(user) = ${idU} 
                  CREATE (user)-[rel:ASKED_MEMBERSHIP{data:"${formattedDate()}"}]->(group) 
                  RETURN rel`;

    db(query,res);
});

// Método para aceitar um pedido de participação
router.put('/ask_membership/:idG/:idU',(req,res,next)=>{
    let idG = parseInt(req.params.idG);
    let idU = parseInt(req.params.idU);
    
    let query = `MATCH (user:User)-[asked:ASKED_MEMBERSHIP]->(group:Group)
                 WHERE id(group) = ${idG} AND id(user) = ${idU} 
                 DELETE asked 
                 CREATE (user)-[rel:IS_MEMBER{date:"${formattedDate()}"}]->(group) 
                 RETURN rel`;

   db(query,res);
}); 

//Método para um convidado aceitar um convite do grupo 
router.put('/invite/:idG/:idI',(req,res,next)=>{
    let idG = parseInt(req.params.idG);
    let idI = parseInt(req.params.idI);
    
    let query = `MATCH (group:Group)-[inv:INVITED]->(user:User)
                 WHERE id(group) = ${idG} AND id(user)=${idI}
                 DELETE inv
                 CREATE (user)-[rel:IS_MEMBER{date:"${formattedDate()}"}]->(group) 
                 RETURN rel`;

    db(query,res);
});


// Método responsável por apagar relaçoes entre um grupo e um usuário desde que essa relação seja
// INVITED, ASKED_MEMBERSHIP ou IS_MEMBER
router.delete('/:idG/:idU',(req,res,next)=>{
    let idG = parseInt(req.params.idG);
    let idU = parseInt(req.params.idU);

    let query = `MATCH (group:Group)-[rel:INVITED |:ASKED_MEMBERSHIP | :IS_MEMBER]-(user:User) 
                WHERE id(group) = ${idG} AND id(user) = ${idU}
                DELETE rel`;

    db(query,res);
});

//Método responsável por deletar o grupo e todas as relações que o mesmo possui
router.delete('/:idG', (req,res,next) => {
    let idG = parseInt(req.params.idG);
    let query = `MATCH (group:Group)-[rel:INVITED |:ASKED_MEMBERSHIP | :IS_MEMBER | :CREATED]-(user:User) 
                WHERE id(group) = ${idG} 
                DELETE rel
                DELETE group`
    db(query,res);
});

module.exports = router;