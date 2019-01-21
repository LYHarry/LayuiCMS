
if(/layuicms2.0\/page/.test(top.location.href) && !/login.html/.test(top.location.href)){
    top.window.location.href = window.location.href.split("layuicms2.0/page/")[0] + 'layuicms2.0/';
}

//var iconUrl = "https://at.alicdn.com/t/font_400842_q6tk84n9ywvu0udi.css";