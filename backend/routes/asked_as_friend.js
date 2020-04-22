const express = require('express');
const router = express.Router();

const db = require('../config/database');
const formattedDate = require('../utils/date');

// Retorna todas as solicitações ( ASKED_AS_FRIEND ) feitas a um usuário
router.get('/:id/:pag',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (node:User)-[rel:ASKED_AS_FRIEND]->(node1:User) 
                 WHERE id(node1) = ${id} 
                 RETURN rel,node SKIP ${pagina} LIMIT 5`;
    db(query,res);
});

//Retorna todas as solicitações (ASKED_AS_FRIEND) feitas por um usuário
router.get('/sent/:id/:pag',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (sender:User)-[rel:ASKED_AS_FRIEND]->(node:User) 
                 WHERE id(sender) = ${id} 
                 RETURN rel,node SKIP ${pagina} LIMIT 5`;
    db(query,res);
});

// pega a relação ASKED_AS_FRIEND entre dois nós
router.get('/:id1/:id2', (req,res,next)=>{
    let id1 = parseInt (req.params.id1);
    let id2 = parseInt (req.params.id2);

    let query = `MATCH (node1:User)-[rel:ASKED_AS_FRIEND]-(node2:User) 
                 WHERE id(node1) = ${id1} AND id(node2) = ${id2} 
                 RETURN node1,rel,node2`;
    db(query,res);
});


// Transforma uma relação do tipo ASKED_AS_FRIEND para IS_FRIEND
router.put('/:id1/:id2', (req,res,next) =>{
    let id1 = parseInt(req.params.id1);
    let id2 = parseInt(req.params.id2);
    let date = formattedDate();

    let query = `MATCH (node:User)-[ask:ASKED_AS_FRIEND]-(node2:User) 
                WHERE id(node) = ${id1} AND id(node2) = ${id2} 
                CREATE (node)-[is_friend:IS_FRIEND{since:"${date}"}]->(node2)
                DELETE ask 
                RETURN node, is_friend,node2`;
    
    db(query,res);

});

// Cria uma relação asked as friend
router.post('/:id1/:id2', (req,res,next)=>{
    let id1 = parseInt(req.params.id1);
    let id2 = parseInt(req.params.id2);
    let date = formattedDate();

    let query = `MATCH (node1:User), (node2:User) 
                WHERE id(node1)=${id1} AND id(node2) = ${id2} 
                CREATE (node1)-[rel:ASKED_AS_FRIEND{date:"${date}"}]->(node2)
                RETURN rel`;
    db(query,res);
});

// Deleta a relação ASKED_AS_FRIEND entre dois nós
router.delete('/:id1/:id2', (req, res, next) =>{
    let id1 = parseInt(req.params.id1);
    let id2 = parseInt(req.params.id2);

    let query = `MATCH (node:User)-[rel:ASKED_AS_FRIEND]-(node2:User) 
                WHERE id(node) = ${id1} AND id(node2) = ${id2}
                DELETE rel`;
    db(query,res);
});

// Deleta todas as relaçãoes ASKED_AS_FRIEND de um nó
router.delete('/:id', (req, res, next) =>{
    let id = parseInt(req.params.id);

    let query = `MATCH (node:User)-[rel:ASKED_AS_FRIEND]-() 
                WHERE id(node) = ${id}
                DELETE rel`;
    db(query,res);
});


module.exports = router;