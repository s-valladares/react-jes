import axios from 'axios'

export class MinisterioService {
    
    UrlBase = 'http://localhost:5000/jes/api'

    getAll(){
        return axios.get(this.UrlBase + '/ministerio').then(res => res.data);
    }

    new(mp){
        return axios.post(this.UrlBase + '/ministerio', mp).then(res => res.data);
    }

    update(id, mp){
        return axios.put(this.UrlBase + '/ministerio/'+ id, mp).then(res => res.data);
    }

    delete(id){
        return axios.delete(this.UrlBase + '/ministerio/'+ id).then(res => res.data);
    }
}