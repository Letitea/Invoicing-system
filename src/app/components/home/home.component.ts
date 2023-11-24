import { Elprof } from './../../models/elprof.model';
import { DOCUMENT } from '@angular/common';
import {
    Component,
    ViewEncapsulation,
    OnInit,
    Inject,
    AfterContentInit,
    AfterViewInit,
    ViewChild,
    QueryList,
    ElementRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { Elbase } from 'src/app/models/elbase.model';
import { CitySelectionService } from 'src/app/services/city-selection.service';
import { CitySelectionComponent } from '../city-selection/city-selection.component';
import { Elpaty } from 'src/app/models/elpaty.model';
import { Elctks } from 'src/app/models/elctks.model';
import { Elcand } from 'src/app/models/elcand.model';
import { NationalVote } from 'src/app/models/national-vote.model';
import { TidyCand } from 'src/app/models/tidy-cand.model';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { TaiwanMap } from 'src/app/models/taiwan-map';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild(CitySelectionComponent)
    private citySelection!: CitySelectionComponent;
    // @ViewChild('citySelection') citySelection!: CitySelectionComponent;
    // @ViewChild(CitySelectionComponent, { static: true }) citySelection: CitySelectionComponent;
    // year= new FormControl(2020);
    // @ViewChild('citySelection') citySelection!: CitySelectionComponent;
    // @ViewChild('citySelection', { static: false }) citySelection!: ElementRef<HTMLElement>;
    // @ViewChild('citySelection', { static: false }) citySelection!: CitySelectionComponent;

    year = 2020;
    years = [2016, 2020];
    category = 'president';
    categorys = [
        'president',
        'regional-legislator',
        'non-district-legislator',
        'mountain-legislator',
        'plain-legislator'
    ];
    city: Elbase = new Elbase();
    district: Elbase = new Elbase();
    village: Elbase = new Elbase();
    taiwan = [
        {
            id: ['GuishanIsland'],
            value: '龜山島'
        },
        {
            id: ['GreenIsland'],
            value: '綠島'
        },
        {
            id: ['Lanyu'],
            value: '蘭嶼'
        },
        {
            id: ['Yilan'],
            value: '宜蘭縣'
        },
        {
            id: ['Hualien'],
            value: '花蓮縣'
        },
        {
            id: ['Taitung'],
            value: '臺東縣'
        },
        {
            id: ['NewTaipei'],
            value: '新北市'
        },
        {
            id: ['Taipei'],
            value: '臺北市'
        },
        {
            id: ['Taoyuan'],
            value: '桃園市'
        },
        {
            id: ['HsinchuCounty'],
            value: '新竹縣'
        },
        {
            id: ['HsinchuCity'],
            value: '新竹市'
        },
        {
            id: ['Lienchiang', 'Lienchiang2'],
            value: '連江縣'
        },
        {
            id: ['Kinmen'],
            value: '金門縣'
        },
        {
            id: ['Penghu', 'Penghu2', 'Penghu3'],
            value: '澎湖縣'
        },
        {
            id: ['Liuqiu'],
            value: '小琉球'
        },
        {
            id: ['Miaoli'],
            value: '苗栗縣'
        },
        {
            id: ['Nantou'],
            value: '南投縣'
        },
        {
            id: ['Taichung'],
            value: '臺中市'
        },
        {
            id: ['Pingtung'],
            value: '屏東縣'
        },
        {
            id: ['Yunlin'],
            value: '雲林縣'
        },
        {
            id: ['ChiayiCounty'],
            value: '嘉義縣'
        },
        {
            id: ['Tainan'],
            value: '臺南市'
        },
        {
            id: ['Kaohsiung'],
            value: '高雄市'
        },
        {
            id: ['ChiayiCity'],
            value: '嘉義市'
        },
        {
            id: ['Changhua'],
            value: '彰化縣'
        },
        {
            id: ['Keelung'],
            value: '基隆市'
        }
    ];
    taiwanMap: TaiwanMap[] = [];
    voteNumberVoterNumber = '0'; //"投票數對選舉人數" 投票率??
    voteNumber = '0'; //"投票數"
    validTicket = '0'; //"有效票"
    invalidTicket = '0'; //"無效票"
    allElprofData: Elprof[] = [];
    chartOption: EChartsOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            bottom: 'bottom'
        },
        series: [
            {
                name: '投票率',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: Number(this.validTicket), name: '有效票' },
                    { value: Number(this.invalidTicket), name: '無效票' }
                ]
            }
        ]
    };
    politicalPartyColorMapping = [
        { name: '民主進步黨', color: '#84CB98', colorClassName: 'DPP' },
        { name: '中國國民黨', color: '#8894D8', colorClassName: 'KMT' },
        { name: '親民黨', color: '#DFA175', colorClassName: 'PFP' }
    ];
    allElpatyData: Elpaty[] = [];
    allElctksData: Elctks[] = [];
    allElcandData: Elcand[] = [];
    nationalVoteData: NationalVote[] = []; //全國各政黨投票率 投票數
    cityVoteData: NationalVote[] = []; //縣市各政黨投票率 投票數
    districtVoteData: NationalVote[] = []; //鄉鎮市區各政黨投票率 投票數
    villageVoteData: NationalVote[] = []; //村里各政黨投票率 投票數
    villageVoteDataGroup = {};
    tidyCandData: TidyCand[] = [];
    // tmpp: any = [];
    chartOption2: EChartsOption = {
        tooltip: {
            trigger: 'item'
        },
        // legend: {
        //   top: '5%',
        //   left: 'center'
        // },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                color: [],
                data: []
            }
        ]
    };

    constructor(@Inject(DOCUMENT) document: Document, private citySelectionService: CitySelectionService) {
        // this.taiwan.forEach((x) => {
        //     // as HTMLElement
        //     document.getElementById(x.id)?.classList.add('noSelectArea');
        // });
        this.getAllJSONFile();
    }
    ngOnInit(): void {}

    initPage() {
        this.citySelection.city = new Elbase();
        this.city = new Elbase();
        this.cityVoteData = [];
        this.citySelection.district = new Elbase();
        this.district = new Elbase();
        this.districtVoteData = [];
        this.citySelection.village = new Elbase();
        this.village = new Elbase();
        this.villageVoteData = [];
        this.voteNumberVoterNumber = ''; //"投票數對選舉人數" 投票率??
        this.voteNumber = ''; //"投票數"
        this.validTicket = ''; //"有效票"
        this.invalidTicket = ''; //"無效票"
        this.getAllJSONFile();
        this.citySelection.clean();
        this.cleanMapActive();
    }
    cleanMapActive() {
        this.taiwan.forEach((x) => {
            x.id.forEach((y) => {
                const element = document.getElementById(y) as HTMLElement;
                element?.classList.remove('active');
            });
        });
    }
    // getProf() {
    //     const thiss = this;
    //     this.citySelectionService.getElprof(this.year, this.category).subscribe({
    //         next(value: Elprof[]) {
    //             thiss.allElprofData = value;
    //             //當縣市未選擇時取全國的，當縣市 鄉鎮市區 村里有選擇時只顯示當下範圍資料
    //             let tmp = new Elprof();
    //             const tmp2 = value.find(
    //                 (x) =>
    //                     x.province == '00' &&
    //                     x.countyCity == '000' &&
    //                     x.constituency == '00' &&
    //                     x.townshipDistrict == '000' &&
    //                     x.village == '0000'
    //             );
    //             tmp = tmp2 ? tmp2 : tmp;
    //             thiss.voteNumberVoterNumber = tmp?.voteNumberVoterNumber;
    //             thiss.voteNumber = tmp?.voteNumber;
    //             thiss.validTicket = tmp?.validTicket;
    //             thiss.invalidTicket = tmp?.invalidTicket;
    //         },
    //         error(err) {
    //             console.error('Observable emitted an error: ' + err);
    //         },
    //         complete() {
    //             console.log('Observable emitted the complete notification');
    //         }
    //     });
    // }

    // getPaty() {
    //     const thiss = this;
    //     this.citySelectionService.getElpaty(this.year, this.category).subscribe({
    //         next(value: Elpaty[]) {
    //             thiss.allElpatyData = value;
    //         },
    //         error(err) {
    //             console.error('Observable emitted an error: ' + err);
    //         },
    //         complete() {
    //             console.log('Observable emitted the complete notification');
    //         }
    //     });
    // }

    // getCand() {
    //     const thiss = this;
    //     this.citySelectionService.getElcand(this.year, this.category).subscribe({
    //         next(value: Elcand[]) {
    //             thiss.allElcandData = value;
    //         },
    //         error(err) {
    //             console.error('Observable emitted an error: ' + err);
    //         },
    //         complete() {
    //             console.log('Observable emitted the complete notification');
    //         }
    //     });
    // }

    // getCtks() {
    //     const thiss = this;
    //     this.citySelectionService.getElctks(this.year, this.category).subscribe({
    //         next(value: Elctks[]) {
    //             thiss.allElctksData = value;
    //         },
    //         error(err) {
    //             console.error('Observable emitted an error: ' + err);
    //         },
    //         complete() {
    //             console.log('Observable emitted the complete notification');
    //         }
    //     });
    // }

    getAllJSONFile() {
        const getProf = this.citySelectionService.getElprof(this.year, this.category);
        const getPaty = this.citySelectionService.getElpaty(this.year, this.category);
        const getCand = this.citySelectionService.getElcand(this.year, this.category);
        const getCtks = this.citySelectionService.getElctks(this.year, this.category);
        forkJoin([getProf, getPaty, getCand, getCtks]).subscribe(([profValue, patyValue, candValue, ctksValue]) => {
            this.allElprofData = profValue;
            //當縣市未選擇時取全國的，當縣市 鄉鎮市區 村里有選擇時只顯示當下範圍資料
            let tmp = new Elprof();
            const tmp2 = profValue.find(
                (x) =>
                    x.province == '00' &&
                    x.countyCity == '000' &&
                    x.constituency == '00' &&
                    x.townshipDistrict == '000' &&
                    x.village == '0000'
            );
            tmp = tmp2 ? tmp2 : tmp;
            this.voteNumberVoterNumber = tmp?.voteNumberVoterNumber;
            this.voteNumber = tmp?.voteNumber;
            this.validTicket = tmp?.validTicket;
            this.invalidTicket = tmp?.invalidTicket;

            this.allElpatyData = patyValue;

            this.allElcandData = candValue;

            this.allElctksData = ctksValue;

            //整理每個縣市是什麼顏色的弄到地圖上
            this.taiwanMap = [];
            this.taiwan.forEach((x) => {
                let tt = this.citySelection.citys.find((y) => y.name == x.value);
                tt = tt ? tt : new Elbase();
                let aa = this.allElctksData.filter(
                    (y) =>
                        // y.mark == '*' &&
                        y.province == tt?.province &&
                        y.countyCity == tt.countyCity &&
                        y.constituency == tt.constituency &&
                        y.townshipDistrict == tt.townshipDistrict &&
                        y.village == tt.village
                );
                aa = aa ? aa : [];
                // let ee = _.maxBy(aa, 'voteNumber')?.candidateNo;
                let ee = _.sortBy(aa, [
                    function (o) {
                        return Number(o.voteNumber);
                    }
                ]).reverse()[0]?.candidateNo;
                ee = ee ? ee : '';

                let bb = this.allElcandData.find((y) => y.no == ee)?.politicalPartyNo;
                bb = bb ? bb : '';
                let cc = this.allElpatyData.find((y) => y.politicalPartyNo == bb)?.politicalPartyName;
                cc = cc ? cc : '';
                let dd = this.politicalPartyColorMapping.find((y) => y.name == cc)?.colorClassName;
                dd = dd ? dd : '';
                this.taiwanMap.push({ id: x.id, value: x.value, colorClassName: dd });
            });
            //塞進地圖
            const thiss = this;
            this.taiwanMap.forEach((x) => {
                if (x.colorClassName !== '') {
                    x.id.forEach((y) => {
                        const element = document.getElementById(y) as HTMLElement;
                        element?.classList.remove('noSelectArea');
                        element?.classList.add(x.colorClassName);
                    });
                }
            });

            this.tidyCandData = [];
            this.allElcandData
                .filter((x) => x.assistant !== 'Y')
                .forEach((y) => {
                    let tmpPoliticalPartyName = this.allElpatyData.find(
                        (z) => z.politicalPartyNo == y.politicalPartyNo
                    )?.politicalPartyName;
                    tmpPoliticalPartyName = tmpPoliticalPartyName ? tmpPoliticalPartyName : '';
                    let tmpAssistantName = this.allElcandData.find(
                        (z) => z.politicalPartyNo == y.politicalPartyNo && z.assistant == 'Y'
                    )?.name;
                    tmpAssistantName = tmpAssistantName ? tmpAssistantName : '';
                    this.tidyCandData.push({
                        politicalPartyNo: y.politicalPartyNo,
                        politicalPartyName: tmpPoliticalPartyName,
                        candidateNo: y.no,
                        assistantName: tmpAssistantName,
                        name: y.name,
                        mark: y.mark
                    });
                });

            this.nationalVoteData = [];
            this.allElctksData
                .filter(
                    (x) =>
                        x.province == '00' &&
                        x.countyCity == '000' &&
                        x.constituency == '00' &&
                        x.townshipDistrict == '000' &&
                        x.village == '0000'
                )
                .forEach((y) => {
                    let tmp = this.tidyCandData.find((z) => z.candidateNo == y.candidateNo);
                    tmp = tmp ? tmp : new TidyCand();
                    let tmp2 = this.politicalPartyColorMapping.find((z) => z.name == tmp?.politicalPartyName);
                    tmp2 = tmp2 ? tmp2 : { name: '', color: '', colorClassName: '' };
                    this.nationalVoteData.push({
                        politicalPartyNo: tmp.politicalPartyNo,
                        politicalPartyName: tmp.politicalPartyName,
                        candidateNo: tmp.candidateNo,
                        assistantName: tmp.assistantName,
                        name: tmp.name,
                        mark: tmp.mark,
                        voteStation: y.voteStation,
                        province: y.province,
                        countyCity: y.countyCity,
                        constituency: y.constituency,
                        townshipDistrict: y.townshipDistrict,
                        village: y.village,
                        voteNumber: y.voteNumber,
                        voteShare: y.voteShare,
                        color: tmp2.color,
                        colorClassName: tmp2.colorClassName
                    });
                });
            //依得票數排序
            this.nationalVoteData = _.sortBy(this.nationalVoteData, [
                function (o) {
                    return Number(o.voteShare);
                }
            ]).reverse();

            // const tmpp = this.nationalVoteData.map((x) => {
            //     return { value: Number(x.voteNumber), name: x.politicalPartyName };
            // });
            // this.tmpp = this.nationalVoteData.map((x) => {
            //     return { value: Number(x.voteNumber), name: x.politicalPartyName };
            // });
            let tmpp: any = this.nationalVoteData.map((x) => {
                return this.politicalPartyColorMapping.find((y) => y.name == x.politicalPartyName)?.color;
            });
            tmpp = tmpp ? tmpp : [];

            this.chartOption2 = {
                tooltip: {
                    trigger: 'item'
                },
                // legend: {
                //   top: '5%',
                //   left: 'center'
                // },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 40,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.nationalVoteData.map((x) => {
                            return { value: Number(x.voteNumber), name: x.politicalPartyName };
                        })
                    }
                ],
                color: tmpp
            };

            // this.chartOption2.series = [
            //     {
            //         name: '',
            //         type: 'pie',
            //         radius: ['40%', '70%'],
            //         avoidLabelOverlap: false,
            //         label: {
            //             show: false,
            //             position: 'center'
            //         },
            //         emphasis: {
            //             label: {
            //                 show: true,
            //                 fontSize: 40,
            //                 fontWeight: 'bold'
            //             }
            //         },
            //         labelLine: {
            //             show: false
            //         },
            //         color: [],
            //         data: [tmpp]
            //     }
            // ];
        });
    }

    onTabClick(event: any) {
        switch (event.tab.textLabel) {
            case '總統副總統大選':
                this.category = 'president';
                break;
            case '區域立法委員':
                this.category = 'regional-legislator';
                break;
            case '不分區立法委員':
                this.category = 'non-district-legislator';
                break;
            case '山地立法委員':
                this.category = 'mountain-legislator';
                break;
            case '平地立法委員':
                this.category = 'plain-legislator';
                break;
        }
    }
    addHover() {
        const thiss = this;
        this.taiwan.forEach((x) => {
            x.id.forEach((y) => {
                // as HTMLElement
                const element = document.getElementById(y) as HTMLElement;
                element?.classList.add('noSelectArea');
                element?.addEventListener('click', function (e: MouseEvent) {
                    // element.getElementsByClassName('noSelectArea')[0].add('active');
                    // element.classList.add('active');
                    // this.focus();
                    thiss.taiwan.forEach((x) => {
                        x.id.forEach((y) => {
                            const element = document.getElementById(y) as HTMLElement;
                            element?.classList.remove('active');
                        });
                        if (x.id.includes(this.id)) {
                            x.id.forEach((y) => {
                                const element = document.getElementById(y) as HTMLElement;
                                element.classList.add('active');
                            });
                            let tmp = thiss.citySelection.citys.find((z) => z.name == x.value);
                            tmp = tmp ? tmp : new Elbase();
                            thiss.citySelection.setCity(tmp);
                        }
                    });
                });
            });
        });
    }

    changeYear(value: number) {
        this.year = value;
        this.initPage();
    }
    getCity(value: Elbase) {
        this.city = value;
        this.citySelection.district = new Elbase();
        this.district = new Elbase();
        this.districtVoteData = [];
        this.citySelection.village = new Elbase();
        this.village = new Elbase();
        this.villageVoteData = [];
        this.taiwan
            .find((x) => x.value == value.name)
            ?.id.forEach((y) => {
                const element = document.getElementById(y) as HTMLElement;
                if (!element.classList.contains('active')) {
                    element.dispatchEvent(new Event('click'));
                }
            });
        //整理縣市的得票排行
        this.cityVoteData = []; //縣市各政黨投票率 投票數
        this.allElctksData
            .filter(
                (x) =>
                    x.province == value.province &&
                    x.countyCity == value.countyCity &&
                    // x.constituency == value.constituency &&
                    x.townshipDistrict == value.townshipDistrict &&
                    x.village == value.village
            )
            .forEach((y) => {
                let tmp = this.tidyCandData.find((z) => z.candidateNo == y.candidateNo);
                tmp = tmp ? tmp : new TidyCand();
                let tmp2 = this.politicalPartyColorMapping.find((z) => z.name == tmp?.politicalPartyName);
                tmp2 = tmp2 ? tmp2 : { name: '', color: '', colorClassName: '' };
                this.cityVoteData.push({
                    politicalPartyNo: tmp.politicalPartyNo,
                    politicalPartyName: tmp.politicalPartyName,
                    candidateNo: tmp.candidateNo,
                    assistantName: tmp.assistantName,
                    name: tmp.name,
                    mark: tmp.mark,
                    voteStation: y.voteStation,
                    province: y.province,
                    countyCity: y.countyCity,
                    constituency: y.constituency,
                    townshipDistrict: y.townshipDistrict,
                    village: y.village,
                    voteNumber: y.voteNumber,
                    voteShare: y.voteShare,
                    color: tmp2.color,
                    colorClassName: tmp2.colorClassName
                });
            });
        //依得票數排序
        this.cityVoteData = _.sortBy(this.cityVoteData, [
            function (o) {
                return Number(o.voteShare);
            }
        ]).reverse();
    }
    getDistrict(value: Elbase) {
        this.district = value;
        this.citySelection.village = new Elbase();
        this.village = new Elbase();
        this.villageVoteData = [];
        //整理鄉鎮市區的得票排行
        this.districtVoteData = []; //鄉鎮市區各政黨投票率 投票數
        this.allElctksData
            .filter(
                (x) =>
                    x.province == value.province &&
                    x.countyCity == value.countyCity &&
                    // x.constituency == value.constituency &&
                    x.townshipDistrict == value.townshipDistrict &&
                    x.village == value.village
            )
            .forEach((y) => {
                let tmp = this.tidyCandData.find((z) => z.candidateNo == y.candidateNo);
                tmp = tmp ? tmp : new TidyCand();
                let tmp2 = this.politicalPartyColorMapping.find((z) => z.name == tmp?.politicalPartyName);
                tmp2 = tmp2 ? tmp2 : { name: '', color: '', colorClassName: '' };
                this.districtVoteData.push({
                    politicalPartyNo: tmp.politicalPartyNo,
                    politicalPartyName: tmp.politicalPartyName,
                    candidateNo: tmp.candidateNo,
                    assistantName: tmp.assistantName,
                    name: tmp.name,
                    mark: tmp.mark,
                    voteStation: y.voteStation,
                    province: y.province,
                    countyCity: y.countyCity,
                    constituency: y.constituency,
                    townshipDistrict: y.townshipDistrict,
                    village: y.village,
                    voteNumber: y.voteNumber,
                    voteShare: y.voteShare,
                    color: tmp2.color,
                    colorClassName: tmp2.colorClassName
                });
            });
        //依得票數排序
        this.districtVoteData = _.sortBy(this.districtVoteData, [
            function (o) {
                return Number(o.voteShare);
            }
        ]).reverse();
    }
    getvVillage(value: Elbase) {
        this.village = value;
        //整理村里的得票排行
        this.villageVoteData = []; //村里各政黨投票率 投票數
        this.allElctksData
            .filter(
                (x) =>
                    x.province == value.province &&
                    x.countyCity == value.countyCity &&
                    //x.constituency == value.constituency &&
                    x.townshipDistrict == value.townshipDistrict &&
                    x.village == value.village &&
                    x.voteStation == '0000'
            )
            .forEach((y) => {
                let tmp = this.tidyCandData.find((z) => z.candidateNo == y.candidateNo);
                tmp = tmp ? tmp : new TidyCand();
                let tmp2 = this.politicalPartyColorMapping.find((z) => z.name == tmp?.politicalPartyName);
                tmp2 = tmp2 ? tmp2 : { name: '', color: '', colorClassName: '' };
                this.villageVoteData.push({
                    politicalPartyNo: tmp.politicalPartyNo,
                    politicalPartyName: tmp.politicalPartyName,
                    candidateNo: tmp.candidateNo,
                    assistantName: tmp.assistantName,
                    name: tmp.name,
                    mark: tmp.mark,
                    voteStation: y.voteStation,
                    province: y.province,
                    countyCity: y.countyCity,
                    constituency: y.constituency,
                    townshipDistrict: y.townshipDistrict,
                    village: y.village,
                    voteNumber: y.voteNumber,
                    voteShare: y.voteShare,
                    color: tmp2.color,
                    colorClassName: tmp2.colorClassName
                });
            });
        //依得票數排序
        this.villageVoteData = _.sortBy(this.villageVoteData, [
            function (o) {
                return Number(o.voteShare);
            }
        ]).reverse();
        //依選區group
        // this.villageVoteDataGroup = _.groupBy(this.villageVoteData, 'voteStation');

        // const multiGroupBy: any = (seq: any, keys: any) => {
        //     if (!keys.length) return seq;
        //     var first = keys[0];
        //     var rest = keys.slice(1);
        //     return _.mapValues(_.groupBy(seq, first), function (value) {
        //         return multiGroupBy(value, rest);
        //     });
        // };
        // this.villageVoteDataGroup = _.groupBy(
        //     this.villageVoteData,
        //     (item) =>
        //         `"${item.province}+${item.countyCity}+${item.constituency}+${item.townshipDistrict}+${item.village}"`
        // );
        // this.villageVoteDataGroup = multiGroupBy(this.villageVoteData, [
        //     'province',
        //     'countyCity',
        //     'constituency',
        //     'townshipDistrict',
        //     'village',
        //     'voteStation'
        // ]);
        // Object.keys(this.villageVoteDataGroup).forEach(x=>{
        //   this.villageVoteDataGroup =this.villageVoteDataGroup[x];
        // })
        // let lastkey=Object.keys(this.villageVoteDataGroup)[0];

        //   this.villageVoteDataGroup = this.villageVoteDataGroup[lastkey];

        // this.villageVoteDataGroup = this.villageVoteDataGroup[Object.keys(this.villageVoteDataGroup).pop()];
        // this.villageVoteDataGroup = this.villageVoteDataGroup[Object.keys(this.villageVoteDataGroup).pop()];
        // this.villageVoteDataGroup = this.villageVoteDataGroup[Object.keys(this.villageVoteDataGroup).pop()];
    }
}
