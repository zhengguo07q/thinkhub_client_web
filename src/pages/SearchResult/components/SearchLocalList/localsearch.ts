import StorageUtil from '@/thinkmind/dataSource/StorageUtil'

class LocalSearch{
    
    async getSearchVal(value:string){
        await StorageUtil.query("", value);
    }

    assemblContent(){

    }

    mergeVal(){

    }

    getPage(key:string, idx:number, len:number=10){

    }
}

export const LocalSearchInstance = new LocalSearch();