const express = require('express');
const router = express.Router();

const db = require('../config/database');
const formattedDate = require('../utils/date');


// retorna todos os depoimentos de um nó que tem a relação has_depo (todos os depoimentos recebidos por um nó juntamente com seu autor)
router.get('/has_depo/:id/:pag', (req,res,next) =>{
    let id = parseInt(req.params.id);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (user:User)-[has:HAS_DEPO]->(depo:Depo)<-[wrote:WROTE]-(sender:User) 
                WHERE id(user) = ${id} 
                RETURN depo, sender SKIP ${pagina} LIMIT 5`;
    db(query,res);
});

// Retorna um depoimento aceito e seu autor específicos
router.get('/has_depo/:idUser/:idDepo', (req,res,next) =>{
    let idUser = parseInt(req.params.idUser);
    let idDepo = parseInt(req.params.idDepo);
    let query = `MATCH (user:User)-[has:HAS_DEPO]->(depo:Depo)<-[wrote:WROTE]-(sender:User) 
                WHERE id(user) = ${idUser} AND id(depo) = ${idDepo} 
                RETURN depo, sender`;
    db(query,res);
});

// Retorna todos os depoimentos e seus autores que precisam ser aceitos por um usuário ( WAITING_CONFIRMATION)
router.get('/waiting_confirmation/:id/:pag', (req,res,next)=>{
    let id = parseInt(req.params.id);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (user:User)<-[waiting:WAITING_CONFIRMATION]-(depo:Depo)<-[wrote:WROTE]-(sender:User) 
                WHERE id(user) = ${id} 
                RETURN depo, sender,waiting SKIP ${pagina} LIMIT 5`;
    db(query,res);
});

// Retorna um depoimento Pendente e seu autor específicos 
router.get('/waiting_confirmation_specific_sender/:idUser/:idDepo', (req,res,next) =>{
    let idUser = parseInt(req.params.idUser);
    let idDepo = parseInt(req.params.idDepo);
    let query = `MATCH (user:User)<-[waiting:WAITING_CONFIRMATION]-(depo:Depo)<-[wrote:WROTE]-(sender:User) 
                WHERE id(user) = ${idUser} AND id(depo) = ${idDepo} 
                RETURN depo, sender`;
    db(query,res);
});

// Retorna todos os depoimentos pendentes escritos plo usuário juntamente com seus destinatários
router.get('/wrote/:id/:pag' , (req,res,next)=>{
    let id = parseInt(req.params.id);
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (user:User)-[wrote:WROTE]->(depo:Depo)-[rel:WAITING_CONFIRMATION]-(reciever:User) 
                WHERE id(user)= ${id} 
                return wrote,depo,rel,reciever SKIP ${pagina} LIMIT 5`;
    db(query,res);

});
// Cria um depoimento entre duas pessoas com o estado (sender)-[wrote]->(depoimento)-[waiting_confirmation]->(reciever)
router.post('/:id1/:id2', (req,res,next)=>{
    let idSender = parseInt(req.params.id1);
    let idReciever = parseInt(req.params.id2);
    let date = formattedDate();
    let area = req.body.area;
    let depo = req.body.depo;

    let query = `MATCH (sender:User), (reciever:User) 
                 WHERE id(sender) = ${idSender} AND id(reciever) = ${idReciever} 
                 CREATE (sender)-[wrote:WROTE]->(depo:Depo{date:"${date}",area:"${area}",depo:"${depo}"})-[waiting:WAITING_CONFIRMATION]->(reciever)
                 RETURN sender, wrote, depo, waiting , reciever`
    db(query,res);
});


//Atualiza uma ligação do tipo WAITING_CONFIRMATION para uma HAS_DEPO
router.put('/:idUser/:idDepo',(req,res,next)=>{
    let idUser = parseInt(req.params.idUser);
    let idDepo = parseInt(req.params.idDepo);

    let query = `MATCH (depo:Depo)-[waiting:WAITING_CONFIRMATION]->(user:User) 
                 WHERE id(depo) = ${idDepo} and id(user) = ${idUser} 
                 DELETE waiting 
                 CREATE (user)-[has:HAS_DEPO]->(depo) 
                 RETURN user, has, depo`;
    db(query,res);
});

//Deleta um Depoimento com a relaçao HAS_DEPO ( Depoimento já aceito )
router.delete('/has_depo/:idUser/:idDepo', (req,res,next) =>{
    let idUser = parseInt(req.params.idUser);
    let idDepo = parseInt(req.params.idDepo);
    let query = `MATCH (user:User)-[has:HAS_DEPO]->(depo:Depo)<-[wrote:WROTE]-(sender:User) 
                WHERE id(user) = ${idUser} AND id(depo) = ${idDepo} 
                 DELETE has,wrote,depo`;
    db(query,res);
});

//Deleta todos os depoimentos que um usuário possui relação HAS_DEPO
router.delete('/has_depo/:id', (req,res,next)=>{
    let idUser = parseInt(req.params.id);
    let query = `MATCH (user:User)-[has:HAS_DEPO]->(depo:Depo)<-[wrote:WROTE]-(sender:User) 
                WHERE id(user) = ${idUser}  
                DELETE has,wrote,depo`;
});

//Deleta um Depoimento com a relaçao Waiting Confirmation ( Depoimento pendente )
router.delete('/waiting_confirmation/:idUser/:idDepo', (req,res,next) =>{
    let idUser = parseInt(req.params.idUser);
    let idDepo = parseInt(req.params.idDepo);
    let query = `MATCH (user:User)<-[waiting:WAITING_CONFIRMATION]-(depo:Depo)<-[wrote:WROTE]-(sender:User) 
                 WHERE id(user) = ${idUser} AND id(depo) = ${idDepo} 
                 DELETE waiting,wrote,depo`; 
    db(query,res);
});

// Deleta todos os depoimentos pendentes de um nó
router.delete('/waiting_confirmation/:id', (req,res,next) =>{
    let idUser = parseInt(req.params.id);
    let query = `MATCH (user:User)<-[waiting:WAITING_CONFIRMATION]-(depo:Depo)<-[wrote:WROTE]-(sender:User) 
                 WHERE id(user) = ${idUser} 
                 DELETE waiting,wrote,depo`;
    db(query,res);
});

//Método que deleta um depoimento escrito por um usuário que ainda não foi aceito
router.delete('/wrote/:idUser/:idDepo', (req,res,next) =>{
    let idUser = parseInt(req.params.idUser);
    let idDepo = parseInt(req.params.idDepo);
    let query = `MATCH (user:User)-[wrote:WROTE]->(depo:Depo)-[rel:WAITING_CONFIRMATION]->(reciever:User)
                 WHERE id(user) = ${idUser} AND id(depo) = ${idDepo} 
                 DELETE wrote,rel,depo`;
    db(query,res);
});

// Deleta todos os depoimentos escritos por um nó
router.delete('/wrote/:id', (req,res,next) =>{
    let idUser = parseInt(req.params.id);
    
    let query = `MATCH (user:User)-[wrote:WROTE]->(depo:Depo)-[rel]-(reciever:User)
                WHERE id(user) = ${idUser}  
                 DELETE wrote,rel,depo`;
    db(query,res);
});

module.exports = router;