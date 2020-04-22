import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AmigosService {

  constructor(private http:HttpClient) { }

  getFriends(id_logado:number,pagina:number){
    let url = `http://localhost:3003/API/is_friend/${id_logado}/${pagina}`;
    return this.http.get<any[]>(url);
  }

  getSolicitationsRecieved(id_logado:number,pagina:number){
    let url = `http://localhost:3003/API/asked_as_friend/${id_logado}/${pagina}`;
    return this.http.get<any[]>(url);
  }

  getSolicitationsSent(id_logado:number,pagina:number){
    let url = `http://localhost:3003/API/asked_as_friend/sent/${id_logado}/${pagina}`;
    return this.http.get<any[]>(url);
  }

  acceptSolicitation(id_user:number,id_logado:number){
    let url = `http://localhost:3003/API/asked_as_friend/${id_user}/${id_logado}`;
    return this.http.put<any[]>(url,{});
  }

  refuseSolicitation(id_user:number,id_logado:number){
    let url = `http://localhost:3003/API/asked_as_friend/${id_logado}/${id_user}`;
    return this.http.delete<any[]>(url);
  }


  getNumeroAmigos(id_logado:number,){
    let url = `http://localhost:3003/API/user/get_friend_number/${id_logado}`;
    return this.http.get<any[]>(url);
  }

  getNumeroPedidosEnviados(id_logado:number){
    let url = `http://localhost:3003/API/user/get_friend_solicitations_sent/${id_logado}`;
    return this.http.get<any[]>(url);
  }

  getNumeroPedidosRecebidos(id_logado:number){
    let url = `http://localhost:3003/API/user/get_friend_solicitations_recieved/${id_logado}`;
    return this.http.get<any[]>(url);
  }
}
