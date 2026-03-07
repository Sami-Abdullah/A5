const isAdmin = ()=>{
  const userName= document.getElementById('user-name')
  const passWord= document.getElementById('pass-word')
  if (userName.value !=="admin" || passWord.value !== "admin123"){
    window.alert("invalid credentails")
    return;
  }
  window.location.href = "index.html"
}