import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { MatSelect, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  endYear: number;
  selectedTopic: string[] = [];
  selectedSector: string[] = [];
  selectedRegion: string[] = [];
  selectedPest: string[] = [];
  selectedSource: string[] = [];
  selectedSwot: string[] = [];
  selectedCountry: string[] = [];
  selectedCity: string[] = [];

  topics: string[] = [];
  endData:string[]=[];
  sectors: string[] = [];
  regions: string[] = [];
  pests: string[] = [];
  sources: string[] = [];
  swots: string[] = [];
  countries: string[] = [];
  cities: string[] = [];

  constructor(private dataService: DataServiceService,private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.data = data;
      this.filteredData = data;

      this.endData=this.extractUniqueValues(data, 'end_year')
      this.topics = this.extractUniqueValues(data, 'topic');
      this.sectors = this.extractUniqueValues(data, 'sector');
      this.regions = this.extractUniqueValues(data, 'region');
      this.pests = this.extractUniqueValues(data, 'pestle');
      this.sources = this.extractUniqueValues(data, 'source');
      this.swots = ['Strength', 'Weakness', 'Opportunity', 'Threat'];
      this.countries = this.extractUniqueValues(data, 'country');
      this.cities = this.extractUniqueValues(data, 'city');
    });
  }

  extractUniqueValues(data: any[], key: string): string[] {
    return [...new Set(data.map(item => item[key]).filter((value): value is string => typeof value === 'string'))];
  }

  applyFilters(): void {
    this.filteredData = this.data.filter(item => {
      return (!this.endYear || item.end_year === this.endYear) &&
             (!this.selectedTopic.length || this.selectedTopic.includes(item.topic)) &&
             (!this.selectedSector.length || this.selectedSector.includes(item.sector)) &&
             (!this.selectedRegion.length || this.selectedRegion.includes(item.region)) &&
             (!this.selectedPest.length || this.selectedPest.includes(item.pestle)) &&
             (!this.selectedSource.length || this.selectedSource.includes(item.source)) &&
             (!this.selectedSwot.length || this.selectedSwot.includes(item.swot)) &&
             (!this.selectedCountry.length || this.selectedCountry.includes(item.country)) &&
             (!this.selectedCity.length || this.selectedCity.includes(item.city));
    });
    this.toggleSidenav();
  }

  closeSelect(select: MatSelect) {
    select.close();
  }

  toggleSidenav() {
    const sidenav = document.getElementById('sidebar-wrapper');
    if (sidenav.style.display === 'none' || sidenav.style.display === '') {
      sidenav.style.display = 'block';
    } else {
      sidenav.style.display = 'none';
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['custom-snackbar']
    });
  }
}
