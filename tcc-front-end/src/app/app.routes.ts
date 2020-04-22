import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { BuscaComponent } from './dashboard/dashboard-main/busca/busca.component';
import { PerfilComponent } from './dashboard/dashboard-main/perfil/perfil.component';
import { GruposComponent } from './dashboard/dashboard-main/grupos/grupos.component';
import { GrupoDetalhesComponent } from './dashboard/dashboard-main/grupo-detalhes/grupo-detalhes.component';
import { AmigosComponent } from './dashboard/dashboard-main/amigos/amigos.component';
import { IndicacoesComponent } from './dashboard/dashboard-main/indicacoes/indicacoes.component';

export const ROUTES:Routes=[
    {path:"", component:LoginComponent},
    {path:"Cadastro", component:CadastroComponent},
    {path:"QuemIndica", component:DashboardComponent,
    children:[
        {path:'', component:DashboardMainComponent},
        {path:'busca', component:BuscaComponent },
        {path:'perfil/:id', component: PerfilComponent},
        {path:'grupos', component: GruposComponent},
        {path:'grupo/:id', component: GrupoDetalhesComponent},
        {path: 'amigos', component: AmigosComponent},
        {path: 'indicacoes', component:IndicacoesComponent}
    ]}
]