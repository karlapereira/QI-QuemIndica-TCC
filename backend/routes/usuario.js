const express = require('express');
const router = express.Router();
const md5 = require('md5');
const db = require('../config/database');

//Método que busca todos os nós do tipo usuário
router.get('/all/:pag', (req, res,next)=>{
    let pag = parseInt(req.params.pag);
    let pagina = pag*5;
    let query = `MATCH (node:User) RETURN node  SKIP ${pagina} LIMIT 5`
    db(query,res)
}); 

//Método que retorna os nós que contém a string no nome ou no email
router.get('/search/:string/:id', (req,res,next)=>{
    let string = req.params.string;
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User) 
                WHERE (node.nome CONTAINS '${string}' OR node.email CONTAINS '${string}') AND  (id(node)<>${id})   
                RETURN node`;
    db(query,res);
});

//Método para retornar a relação entre dois nós
router.get('/get_relation/:id1/:id2', (req,res,next)=>{
    let id1 = parseInt(req.params.id1);
    let id2 = parseInt(req.params.id2);
    let query= `MATCH(node:User)-[rel]-(node2:User)
                 WHERE id(node) = ${id1} AND id(node2) = ${id2} 
                 RETURN rel`;
    db(query,res);
});
//método que retorna um usuário de acordo com o token
router.get('/:token' , (req,res,next) =>{
    let token = req.params.token;
    
    let query = `MATCH (node:User) 
                  WHERE node.token = "${token}" 
                  RETURN node`;
    db(query,res);
});

//método que retorna um usuário de acordo com o ID 
router.get('/get_by_id/:id', (req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User) 
                  WHERE id(node) = ${id} 
                  RETURN node`;
    db(query,res);
});

//Método para retornar um usuário com e-mail passado como parâmetro ( checar se o usuário já foi cadastrado )
router.get('/check/:email',(req,res,next)=>{
    let email = req.params.email;
    let query = `MATCH (node:User) 
                  WHERE node.email = "${email}" 
                  RETURN COUNT(node) as n`;
    db(query,res);

});

//Retorna o número de solicitações de amizade feitas a um usuário
router.get('/get_friend_solicitations_recieved/:id',(req,res,next)=>{
  let id = parseInt(req.params.id);
  let query = `MATCH (node:User)<-[asked:ASKED_AS_FRIEND]-(node2:User)   
               WHERE id(node) = ${id} 
               RETURN  COUNT(asked) as friends`;
  db(query,res); 
});

// Retorna o número de solicitações de amizade enviadas por um usuário
router.get('/get_friend_solicitations_sent/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)-[asked:ASKED_AS_FRIEND]->(node2:User)   
                 WHERE id(node) = ${id} 
                 RETURN  COUNT(asked) as friends`;
    db(query,res); 
  });

//Retorna o número de solicitações de depoimentos feitas a um usuário
router.get('/get_depo_solicitations/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)<-[waiting:WAITING_CONFIRMATION]-(depo:Depo)   
                 WHERE id(node) = ${id} 
                 RETURN  COUNT(waiting) as depos`;
    db(query,res); 
});

//Retorna o número de convites de participação de grupo feitas a um usuário
router.get('/get_group_invitations/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)<-[inv:INVITED]-(group:Group)   
                 WHERE id(node) = ${id} 
                 RETURN  COUNT(inv) as invites`;
    db(query,res); 
});

//Retorna o número de amigos de um usuário
router.get('/get_friend_number/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)-[rel:IS_FRIEND]-(node2:User) 
                 WHERE id(node) = ${id} 
                 RETURN COUNT (rel) as friends`;
    db(query,res);
})

//Retorna o número de depoimentos de um usuário
router.get('/get_depo_number/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)-[rel:HAS_DEPO]->(depo:Depo) 
                 WHERE id(node) = ${id} 
                 RETURN COUNT (rel) as depos`;
    db(query,res);
});

//Retorna o número depoimentos escritos por um usuário
router.get('/get_written_depo_number/:id', (req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)-[rel:WROTE]->(depo:Depo) 
                 WHERE id(node) = ${id} 
                RETURN COUNT (rel) as depos`
});

//retorna o número de depoimentos escritos que não foram aceitos
router.get('/get_written_waiting_depo/:id', (req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)-[wrote:WROTE]->(depo:Depo)-[waiting:WAITING_CONFIRMATION]->(reciever:User)
                WHERE id(node)=${id}
                RETURN COUNT (waiting) as sent`;
    db(query,res);
}); 

//retorna o número de depoimentos recebidos por um usuário que não foi aceito
router.get('/get_recieved_waiting_depo/:id', (req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (sender:User)-[wrote:WROTE]->(depo:Depo)-[waiting:WAITING_CONFIRMATION]->(node:User)
                 WHERE id(node)=${id}
                 RETURN COUNT (waiting) as recieved`
    db(query,res);
})

//Retorna o número de grupos que um usuário faz parte
router.get('/get_group_number/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)-[rel:IS_MEMBER | :CREATED]->(group:Group) 
                 WHERE id(node) = ${id} 
                 RETURN COUNT (rel) as groups`;
    db(query,res);
});

//Retorna o número de grupos que um usuário criou
router.get('/get_created_group_number/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)-[rel:CREATED]->(group:Group) 
                 WHERE id(node) = ${id} 
                 RETURN COUNT (rel) as created`;
    db(query,res);
});

//Retorna o número de grupos que um usuário pediu para participar
router.get('/get_asked_group_number/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (node:User)-[rel:ASKED_MEMBERSHIP]->(group:Group) 
                 WHERE id(node) = ${id} 
                 RETURN COUNT (rel) as asked`;
    db(query,res);
});

//Método para inserir um usuário
router.post('/', (req,res,next) =>{
    let nome = req.body.nome;
    let email = req.body.email;
    let token = req.body.token;
    let foto = req.body.foto;
    let profissao = req.body.profissao;
    let local  = req.body.local;

    let query = `CREATE ( node:User {token:"${token}",nome:"${nome}",email:"${email}", foto:"${foto}", profissao:"${profissao}", local:"${local}" })
              RETURN node`;
     db(query, res);
});

// Altera um nó do tipo usuário
router.put('/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let nome = req.body.nome;
    let email = req.body.email;
    let foto = req.body.foto;
    let profissao = req.body.profissao;
    let local  = req.body.local;

    let query = `MATCH (node:User) WHERE id(node) = ${id} 
                 SET node.token = "${token}",node.nome = "${nome}", node.email = "${email}", node.foto = "${foto}", node.profissao = "${profissao}", node.local="${local}" 
                 RETURN node`;
    
    db(query,res);

});

//Método que deleta um usuário 
router.delete('/:id',(req,res,next)=>{
    let id = parseInt(req.params.id);
    let query = `MATCH (n:User)
                WHERE id(n) = ${id}
                DELETE n`;
    db(query,res);
})


module.exports = router;
