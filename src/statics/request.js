const transform = (res)=>{
  if(res.status == 401){
    Next.Message.warning({ title: '登录状态已过期', duration: 2000, afterClose:()=>{ window.location.href = '/login.html' } })
    return Promise.reject(res)
  }
  if(res.redirected){
    const url = new URL(res.url)
    if(url.pathname && url.pathname == '/login.html'){
      Next.Message.warning({ title: '登录状态已过期，请您在弹出的窗口中重新登陆后再操作吧！',  duration:2000 })
      window.open('/login.html?action=close', 'Login', 'width=800,height=600')
      return Promise.reject({ status: 401 , url: '/login.html', message:'登录状态已过期' })
    }else{
      window.location = res.url
    }
    return Promise.reject(res)
  }
  if(res.status === 200){
    return res.text().then(data=>JSON.parse(data))
  }
  if(res.status === 204){
    return null
  }
  if(res.status >= 500){
    try {
      res.text().then(data=>JSON.parse(data)).then(data=>{ Next.Message.error({ title: data ? data.message : "系统错误" }) })
    } catch (error) {
      Next.Message.error({ title: res.statusText })
    }
  }
  return Promise.reject(res)
}

const request = {
  get:(url) => fetch(url).then(transform),
  post:(url, data)=>fetch(url, {method:'POST', body: JSON.stringify(data), headers:{'Content-Type':'application/json'} }).then(transform),
}

window.request = request