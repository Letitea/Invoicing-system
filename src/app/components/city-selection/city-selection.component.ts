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
        city: this.formBuilder.control(
            ''
            //Validators.required
        ),
        district: this.formBuilder.control(
            ''
            //Validators.required
        ),
        village: this.formBuilder.control('', [
            //Validators.required
        ])
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

                // thiss.citys=value.filter(x=>x.縣市=='000'&&x.選區=='00'&&x.鄉鎮市區=='000'&&x.村里=='0000');
                // thiss.citys.push('測試1');
                // thiss.citys.push('測試2');
                // console.log('Observable emitted the next value: ' + value);
            },
            error(err) {
                console.error('Observable emitted an error: ' + err);
            },
            complete() {
                console.log('Observable emitted the complete notification');
            }
        });
    }

    createPost() {
        // const article = {
        //   title: this.post.value.title || '',
        //   description: this.post.value.description || '',
        //   body: this.post.value.body || '',
        //   tagList: [...(this.post.value.tags || [])] as string[],
        //   // tagList: <Array<string>>(
        //   //   (this.post.value.tags || []).filter((tag) => !!tag)
        //   // ),
        // };
        // this.postService.createArticle(article).subscribe(() => {
        //   this.router.navigate(['/']);
        // });
    }
    changeCity(value: Elbase) {
        // const tmp=this.allElbaseData.find(x=>x.名稱==value.名稱);
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
        // const tmp=this.allElbaseData.find(x=>x.名稱==value.名稱);
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
