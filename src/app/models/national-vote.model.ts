import { TidyCand } from './tidy-cand.model';

export class NationalVote extends TidyCand {
    province: string = ''; //"省市別"
    countyCity: string = ''; //"縣市別"
    constituency: string = ''; //"選區別"
    townshipDistrict: string = ''; //"鄉鎮市區"
    village: string = ''; //"村里別"
    voteNumber: string = ''; //"得票數"
    voteShare: string = ''; //"得票率"
    voteStation: string = ''; //投開票所
    color: string = '';
    colorClassName: string = '';
}
