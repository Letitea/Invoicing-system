import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Elbase } from 'src/app/models/elbase.model';
import { Selection } from 'src/app/models/selection.model';
import { CitySelectionService } from 'src/app/services/city-selection.service';

@Component({
    selector: 'app-city-selection',
    templateUrl: './city-selection.component.html',
    styleUrl: './city-selection.component.scss'
})
export class CitySelectionComponent implements OnInit {
    post = this.formBuilder.group({
        city: this.formBuilder.control(''),
        district: this.formBuilder.control(''),
        village: this.formBuilder.control('', [])
    });
    @Input() year: number = 2020;
    @Input() category: string = 'president';
    citys: Elbase[] = [];
    city: Elbase = new Elbase();
    districts: Elbase[] = [];
    district: Elbase = new Elbase();
    villages: Elbase[] = [];
    village: Elbase = new Elbase();
    allElbaseData: Elbase[] = [];
    @Output() cityChange = new EventEmitter<Elbase>();
    @Output() districtChange = new EventEmitter<Elbase>();
    @Output() villageChange = new EventEmitter<Elbase>();

    constructor(private formBuilder: FormBuilder, private citySelectionService: CitySelectionService) {}
    ngOnInit(): void {
        const thiss = this;
        this.citySelectionService.getElbase(this.year, this.category).subscribe({
            next(value: Elbase[]) {
                thiss.allElbaseData = value;
                thiss.citys = value.filter(
                    (x) =>
                        x.constituency == '00' &&
                        x.townshipDistrict == '000' &&
                        x.village == '0000' &&
                        x.province !== '00'
                );
            },
            error(err) {
                console.error('Observable emitted an error: ' + err);
            },
            complete() {
                console.log('Observable emitted the complete notification');
            }
        });
    }

    createPost() {}
    changeCity(value: Elbase) {
        this.districts = this.allElbaseData.filter(
            (x) =>
                x.village == '0000' &&
                x.province == value.province &&
                x.countyCity == value.countyCity &&
                x.constituency == value.constituency &&
                x.townshipDistrict !== '000'
        );
        this.cityChange.emit(value);
    }

    changeDistrict(value: Elbase) {
        if (this.city == new Elbase()) {
            return;
        }
        this.villages = this.allElbaseData.filter(
            (x) =>
                x.village !== '0000' &&
                x.province == value.province &&
                x.countyCity == value.countyCity &&
                x.constituency == value.constituency &&
                x.townshipDistrict == value.townshipDistrict
        );
        this.districtChange.emit(value);
    }

    changevVillage(value: Elbase) {
        if (this.district == new Elbase()) {
            return;
        }
        this.villageChange.emit(value);
    }

    clean() {
        this.city = new Elbase();
        this.district = new Elbase();
        this.village = new Elbase();
        this.changeCity(this.city);
        this.changeDistrict(this.district);
        this.changevVillage(this.village);
    }
    setCity(value: Elbase) {
        this.city = value;
        this.changeCity(value);
    }
}
