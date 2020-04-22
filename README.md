# TCC

Projeto de conclusão de curso do curso de Engenharia da Computação no Instituto Nacional de Telecomunidações

### Resumo

O projeto se consiste no protótipo de uma rede social na qual é possível deixar depoimentos sobre experiências acadêmica/profissionais, além de poder unir grupos que já trabalharam juntos. O trabalho possui como grande diferencial o banco de dados orientado a grafo [Neo4J](https://neo4j.com/), que nos permite fazer ligações entre nós além de percorrer o grafo

### Pré requisitos

Para que o projeto funcione normalmente é necessário que seja instalado:
* [NodeJS](https://nodejs.org/en/)    - Responsável pela comunicação com o banco
* [Neo4J](https://neo4j.com/download/)     - Banco de dados utilizado pelo projeto
* [Angular 6](https://angular.io/) - Framework web responsável pelo front-end

### Como utilizar
* Clone o repositório
* Navegue até a pasta
* Crie um banco de dados no Neo4J e troque as configurações em [database.js](backend/config/database.js) na linha 4
```
    var db = new neo4j.GraphDatabase('http://<USER>:<PASSWORD>@localhost:7474');
```
* Com o Neo4J rodando execute o arquivo [backend-runner.sh](backend-runner.sh)
* E por fim, execute o arquivo [frontend-runner.sh](frontend-runner.sh)

## Autores

* **Lucas Gaspar** - *Backend e Frontend* - E-mail: lucasgaspar@gec.inatel.br
* **Karla Pereira** - *Documentação e Artigo* - E-mail: karlapereira@gec.inatel.br 
* **Rafael Souza** - *Backend e Frontend* - E-mail: rafaelsouza@gec.inatel.br
* **Maria Isabel** - *Documentação e Artigo* - E-mail: 

## Orientador
* **Renzo Paranaíba Mesquita** - *Professor Orientador* - E-mail: 
