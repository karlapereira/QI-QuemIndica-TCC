import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as md5 from '../../../node_modules/md5';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  user_img: string = "";// = "../../assets/images/menu_user.png";

  constructor(private http:HttpClient, private toastr:ToastrService,private router:Router,) { }

  ngOnInit() {
  }

  cadastrar (form:any){
    this.emailDontExists(form);
    let email = form.email;
    let senha = form.senha;
    let nome = form.nome;
    let foto = this.user_img;
    let profissao = form.profissao;
    let local = form.local;
    let pre_token = email+senha;
    let token = md5(pre_token);
    
    let new_user = {
      "nome": nome,
      "email": email,
      "token": token,
      "foto":  foto,
      "profissao": profissao,
      "local":  local
    };

    this.http.post<any[]>("http://localhost:3003/API/user",new_user).subscribe(res =>{
      if( res.length !== 0 ){
        localStorage.setItem("user", JSON.stringify(res[0]));
        this.toastr.success('Sucesso, seja bem vindo ao ConnectU!','Deu bom!',{timeOut:5000});
        this.router.navigate(['/QuemIndica']);
      }else{
        this.toastr.error('Ops, algo deu muito errado :(!','Deu ruim!',{timeOut:5000});
      }
    });
    
  }

  isButtonDisabled(form:any,senha:string,resenha:string){
    return (!form.valid || senha!==resenha);
  }

  emailDontExists(form:any):boolean{
    let email = form.email;
    let url = `http://localhost:3003/API/user/check/${email}`;
    
    this.http.get<any[]>(url).subscribe(res=>{
      let number = res[0].n
      console.log(number);
      
    });

    return false;
  }


  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.user_img = String(myReader.result);
    }
    myReader.readAsDataURL(file);
  }

}
