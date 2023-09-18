import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Registro, RegistroRequest } from 'src/app/_model/registros/registro';
import { SelectionModel } from '@angular/cdk/collections';
import { RegistroService } from 'src/app/_service/registro.service';
import { merge, startWith, switchMap, of as observableOf, catchError, map } from 'rxjs';

@Component({
  selector: 'app-lreporte',
  templateUrl: './lreporte.component.html',
  styleUrls: ['./lreporte.component.css']
})
export class LreporteComponent implements OnInit  {

  dataSource: Registro[] = [];
  displayedColumns: string[] = ['nombreConocido', 'ticketsPendientes', 'ticketsTotal'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;


  request = new RegistroRequest();

  selection = new SelectionModel<Registro>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private registroService : RegistroService,
    public customPaginator: MatPaginatorIntl    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.registroService = new RegistroService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.loading = true;
        return this.registroService!.GetTotalTicketsXUsuario(
        ).pipe(catchError(() => observableOf(null)));
      }),
      map(res => {

        this.loading = false;
        this.existRegistro = res === null;

        this.selection = new SelectionModel<Registro>(true, []);

        if (res === null) {
          return [];
        }
        this.countRegistro = 0;

        console.log(res.items);
        return res.items;
      }),
    ).subscribe(data => (this.dataSource = data));
  }
}
