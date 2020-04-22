import { Component, OnInit } from '@angular/core';
import { AmigosService } from './amigos.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})
export class AmigosComponent implements OnInit {

  id_logado:number;
  pag_amigos:number=0;
  num_amigos:number=0;
  pag_esperando_aceitacao:number=0;
  num_esperando_aceitacao:number=0;
  pag_mandou_convite:number=0;
  num_mandou_convite:number=0;
  amigos:any[]= [];
  pendentes:any[]=[];
  pedidos:any[]=[];

  constructor(private amigosService:AmigosService, private toastr:ToastrService, private router:Router) { }

  ngOnInit() {
    
    this.id_logado = JSON.parse(localStorage.getItem('user')).node._id;
    this.pag_amigos = 0 ;
    this.pag_esperando_aceitacao = 0;
    this.pag_mandou_convite = 0 ;
    
    this.amigosService.getFriends(this.id_logado,this.pag_amigos).subscribe(res=>{
      for( let index = 0; index< res.length; index++ ){
        this.amigos.push(res[index]);
      }
    });

    this.amigosService.getSolicitationsRecieved(this.id_logado,this.pag_esperando_aceitacao).subscribe(res=>{
      for( let index = 0; index< res.length; index++ ){
        this.pendentes.push(res[index]);
      } 
    });

    this.amigosService.getSolicitationsSent(this.id_logado,this.pag_mandou_convite).subscribe(res=>{
      for( let index = 0; index< res.length; index++ ){
        this.pedidos.push(res[index]);
      } 
    })
    this.getNumbers();

  }

  verPerfil(id:number){
    this.router.navigate(['/QuemIndica/perfil', id]);
  }

  acceptSolicitation(user:any){
    let amigo = {
      node:{
        label:['User'],
        _id:user.node._id,
        properties:{
          foto: user.node.properties.foto,
          email: user.node.properties.email,
          local: user.node.properties.local,
          nome: user.node.properties.nome,
          profissao: user.node.properties.profissao,
          token: user.node.properties.token
        }
      },
      rel:{
        _id:0,
        _fromId:0,
        _toId:0,
        type: "IS_FRIEND",
        properties:{
          since:""
        }
      }
    }
    this.amigosService.acceptSolicitation(user.node._id,this.id_logado).subscribe(res=>{
      if(res.length>0){
        amigo.rel.properties.since = res[0].is_friend.properties.since
        amigo.rel._id = res[0].is_friend._id
        amigo.rel._fromId = res[0].is_friend._fromId
        amigo.rel._toId = res[0].is_friend._toId
        let index = this.pendentes.indexOf(user);
        this.num_amigos++;
        this.num_esperando_aceitacao --;
        if(index == 0 ) this.pendentes.shift();
        else if (index === (this.pendentes.length - 1 ))  this.pendentes.pop();
        else this.pendentes.splice(index,1);
        this.amigos.push(amigo);
        this.toastr.success("Amigo adicionado com sucesso!","Muito bom");
      }
      else{
        this.toastr.error("Não conseguimos firmar esse laço", "Ops");
      }
    });
  }

  refuseSolicitation(user:any){
    this.amigosService.refuseSolicitation(user.node._id, this.id_logado).subscribe(res=>{
      if (res.length === 0 ){
        this.toastr.success("Pedido recusado","Consguimos");
        this.num_esperando_aceitacao--;
        let index = this.pendentes.indexOf(user);
        if(index == 0 ) this.pendentes.shift();
        else if (index === (this.pendentes.length - 1 ))  this.pendentes.pop();
        else this.pendentes.splice(index,1);
      }else{
        this.toastr.error("Não recusar o pedido de amizade","Ops");
      }
    })
  }

  cancelSolicitation(user:any){
    this.amigosService.refuseSolicitation(user.node._id, this.id_logado).subscribe(res=>{
      if (res.length === 0 ){
        this.toastr.success("Pedido cancelado","Consguimos");
        this.num_mandou_convite--;
        let index = this.pedidos.indexOf(user);
        if(index == 0 ) this.pedidos.shift();
        else if (index === (this.pedidos.length - 1 ))  this.pedidos.pop();
        else this.pedidos.splice(index,1);
      }else{
        this.toastr.error("Não cancelar o pedido de amizade","Ops");
      }
    })
  }

  getMoreFriends(){
    this.pag_amigos++;
    this.amigosService.getFriends(this.id_logado,this.pag_amigos).subscribe(res=>{
      for( let index = 0; index< res.length; index++ ){
        this.amigos.push(res[index]);
      }
    })
  }

  getMoreSolicitationsRecieved(){
    this.pag_esperando_aceitacao++;
    this.amigosService.getSolicitationsRecieved(this.id_logado,this.pag_esperando_aceitacao).subscribe(res=>{
      for( let index = 0; index< res.length; index++ ){
        this.pendentes.push(res[index]);
      }
    })
  }

  getMoreSolicitationSent(){
    this.pag_mandou_convite++;
    this.amigosService.getSolicitationsSent(this.id_logado,this.pag_mandou_convite).subscribe(res=>{
      for( let index = 0; index< res.length; index++ ){
        this.pedidos.push(res[index]);
      }
    })
  }

  showGetMoreFriends(){
    if(this.num_amigos>5 && this.amigos.length<this.num_amigos) return true;
    else return false;
  }
  showGetMoreSolicitationSent(){
    if(this.num_esperando_aceitacao>5 && this.pendentes.length<this.num_esperando_aceitacao) return true;
    else return false;
  }

  showGetMoreSolicitationsRecieved(){
    if(this.num_mandou_convite>5 && this.pedidos.length<this.num_mandou_convite) return true;
    else return false;
  }

  getNumbers(){
    this.amigosService.getNumeroAmigos(this.id_logado).subscribe(res=>{
      if(res.length>0){
        this.num_amigos=res[0].friends;
      } 
      else this.num_amigos = 0;
    });
    
    this.amigosService.getNumeroPedidosEnviados(this.id_logado).subscribe(res=>{
      if(res.length>0){
        this.num_mandou_convite=res[0].friends;
      } 
      else this.num_mandou_convite = 0;
    });
    
    this.amigosService.getNumeroPedidosRecebidos(this.id_logado).subscribe(res =>{
      if(res.length>0){
        this.num_esperando_aceitacao=res[0].friends;
      } 
      else this.num_esperando_aceitacao = 0;
    });

  }

}
