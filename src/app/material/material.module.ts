import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SpinnerModule } from '../page/component/spinner/spinner.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {CustomDateAdapter } from './custom-adapter';
import {FlexLayoutModule } from '@angular/flex-layout';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTreeModule} from '@angular/material/tree';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
  ],
  exports:[
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatSidenavModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatRadioModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SpinnerModule,
    MatAutocompleteModule,
    MatSelectModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatGridListModule,
    MatStepperModule,
    MatListModule,
    MatTabsModule,
    MatExpansionModule,
    MatTreeModule
    ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class MaterialModule { }
