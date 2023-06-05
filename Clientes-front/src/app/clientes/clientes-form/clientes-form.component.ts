import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs';

import { Cliente } from '../cliente'
import { ClientesService } from '../../clientes.service';


@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css']
})
export class ClientesFormComponent implements OnInit {

  cliente: Cliente;
  success: boolean = false;
  errors: String [];
  id: number;
  typePeoplePJ: boolean = false;
  typePeople: String;

  constructor( 
    private service: ClientesService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute
    ) { 
    this.cliente = new Cliente();
  }

  ngOnInit() : void {
    let params : Observable<Params> = this.activatedRoute.params
    params.subscribe( urlParams => {
      this.id = urlParams['id'];
      this.cliente.status =true;
      if(this.id) {
        this.service
        .getClienteById(this.id)
        .subscribe(
          response => this.cliente = response ,
          errorResponse => this.cliente = new Cliente ()
          )
      }
    })
  }

  onSubmit() {
    if(this.id) {
      this.service
      .atualizar(this.cliente)
      .subscribe(response => {
        this.success = true;
        this.errors = null;
      
        } , errorResponse => {
          this.errors = ['Erro ao atualizar o cliente.']
        })

    } else {
      this.service
      .salvar(this.cliente)
      .subscribe(response => {
        this.success = true;
        this.errors = null;
        this.cliente = response
      } , errorResponse => {
        this.success = false;
      this.errors = errorResponse.error.errors;
      }
    )
    }    
  }

  selecionaTipoPessoa(value: string) {
    this.typePeople = value;
    if(this.typePeople.indexOf("PJ")) {
      this.typePeoplePJ = true;
    } else {  
      this.typePeoplePJ = false;
    }
  }

  voltarParaListagem() {
    this.router.navigate(['/clientes-lista']);
  }
}