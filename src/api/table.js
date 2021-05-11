import request from '@/utils/request'

export function kvReadList(p) {
  return request({
    url: '/api/kv/'+p.b+'/'+p.k,
    method: 'get'
  })
}

export function kvCreate(p) {
  return request({
    url: '/api/kv/'+p.bucket+'/'+p.key,
    method: 'post',
    data: p.json
  })
}
export function kvUpdate(p,id) {
  return request({
    url: '/api/kv/'+p.bucket+'/'+p.key+'/'+id,
    method: 'put',
    data: p.json
  })
}
export function kvUpdateWeight(p,id) {
  return request({
    url: '/api/kv/'+p.bucket+'/'+p.key+'/'+id+'/weight',
    method: 'put'
  })
}

export function kvDelete(p,id) {
  return request({
    url: '/api/kv/'+p.bucket+'/'+p.key+'/'+id,
    method: 'delete'
  })
}

export function kvSearch(p) {
  //console.info(JSON.stringify(p))
  return request({
    url: '/api/search',
    method: 'get',
    params: p
  })
}
