import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ROUTES } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
//TOASTR
import { ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// APP COMPONENTS
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { BuscaComponent } from './dashboard/dashboard-main/busca/busca.component';
import { PerfilComponent } from './dashboard/dashboard-main/perfil/perfil.component';
import { GruposComponent } from './dashboard/dashboard-main/grupos/grupos.component';
import { GrupoDetalhesComponent } from './dashboard/dashboard-main/grupo-detalhes/grupo-detalhes.component';
import { AmigosComponent } from './dashboard/dashboard-main/amigos/amigos.component';
import { IndicacoesComponent } from './dashboard/dashboard-main/indicacoes/indicacoes.component';

//APP SERVICES
import { PerfilService } from './dashboard/dashboard-main/perfil/perfil-service.service';
import { GruposService } from './dashboard/dashboard-main/grupos/grupos-service.service';
import { GrupoDetalhesService } from './dashboard/dashboard-main/grupo-detalhes/grupo-detalhes-service.service';
import { AmigosService } from './dashboard/dashboard-main/amigos/amigos.service';
import { IndicacoesService } from './dashboard/dashboard-main/indicacoes/indicacoes.service'
import { DashboardMainService } from './dashboard/dashboard-main/dashboard-main-service.service';
import { MenuService } from './menu/menu.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    DashboardMainComponent,
    CadastroComponent,
    BuscaComponent,
    PerfilComponent,
    GruposComponent,
    GrupoDetalhesComponent,
    AmigosComponent,
    IndicacoesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    PerfilService,
    GruposService,
    GrupoDetalhesService,
    AmigosService,
    IndicacoesService,
    DashboardMainService,
    MenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
