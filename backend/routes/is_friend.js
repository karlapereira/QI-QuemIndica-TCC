const express = require('express');
const router = express.Router();

const db = require('../config/database');
const formattedDate = require('../utils/date');

// pega todas as relações IS_FRIEND de um nó ( Retorna todos os amigos de um determinado nó)
router.get('/:id/:pag', (req,res,next)=>{
    let id = parseInt (req.params.id);
    let pag = parseInt (req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (n:User)-[rel:IS_FRIEND]-(node:User) 
                 WHERE id(n) = ${id} 
                 RETURN rel,node  SKIP ${pagina} LIMIT 5`;
    db(query,res);
});
// pega a relação IS_FRIEND entre dois nós
router.get('/:id1/:id2', (req,res,next)=>{
    let id1 = parseInt (req.params.id1);
    let id2 = parseInt (req.params.id2);

    let query = `MATCH (node1:User)-[rel:IS_FRIEND]-(node2:User) 
                 WHERE id(node1) = ${id1} AND id(node2) = ${id2} 
                 RETURN node1,rel,node2`;
    db(query,res);
});

// Cria uma relação IS_FRIEND entre dois nós
router.post('/:id1/:id2', (req, res, next) =>{
    let id1 = parseInt (req.params.id1);
    let id2 = parseInt (req.params.id2);
    let date = formattedDate();
    let query = `MATCH (node1:User),(node2:User) 
                 WHERE id(node1) = ${id1} AND id(node2) = ${id2} 
                 CREATE (node1)-[rel:IS_FRIEND{since:"${date}"}]->(node2)
                 RETURN rel`;
    db(query,res);
});


// Deleta todas as relaçãoes IS_FRIENDS de um nó
router.delete('/:id', (req, res, next) =>{
    let id = parseInt(req.params.id);

    let query = `MATCH (node:User)-[rel:IS_FRIEND]-() 
                WHERE id(node) = ${id}
                DELETE rel`;
    db(query,res);
});


// Deleta a relação IS_FRIEND entre dois nós
router.delete('/:id1/:id2', (req, res, next) =>{
    let id1 = parseInt(req.params.id1);
    let id2 = parseInt(req.params.id2);

    let query = `MATCH (node:User)-[rel:IS_FRIEND]-(node2:User) 
                WHERE id(node) = ${id1} AND id(node2) = ${id2}
                DELETE rel`;
    db(query,res);
});

module.exports = router;