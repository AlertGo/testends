var express=require('express');
var mysql=require('mysql');
var router=express.Router();
var fs=require('fs');
var formidable=require('formidable');

var pool=mysql.createPool({
	host:'localhost',//localhost
	user:'root',   //用户名
	password:'root',    //密码
	database:'exam', //数据库
	port:8889
});

//删除
router.post('/deles',function(req,res){
	res.header("Access-Control-Allow-Origin","*")
	var id=req.body['id']
	pool.query(`delete from newsimg where id='${id}'`,function(err,rows,fields){
		if(err){
			console.log(err)
		}else{
			res.send("1")
		}

	})
})
//删除LIST

router.post('/newsdelete',function(req,res){
	res.header("Access-Control-Allow-Origin","*")
	var id=req.body['id']
	pool.query(`delete from news where id='${id}'`,function(err,rows,fields){
		if(err){
			console.log(err)
		}else{
			res.send("1")
		}

	})
})
//删除DETAIL
router.post('/newsdetaildelete',function(req,res){
	res.header("Access-Control-Allow-Origin","*")
	var id=req.body['id']
	pool.query(`delete from newsdetail where id='${id}'`,function(err,rows,fields){
		if(err){
			console.log(err)
		}else{
			res.send("1")
		}

	})
})
//详情页跳转
router.post('/newsdetail',function(req,res){
	res.header("Access-Control-Allow-Origin", "*")
	var id=req.body['id']
	pool.query(`SELECT * from news where id='${id}'`, function(err, rows, fields) {
  	if (err) throw err;
 	  res.send(rows)
	});
});

//替换
router.post("/replace",function(req,res){
	res.header("Access-Control-Allow-Origin","*")
	var id=req.body["id"]
	var imgstr=req.body["imgstr"]
	console.log(id)
	pool.query(`UPDATE newsimg SET img='${imgstr}' where id='${id}'`,function(err,rows,f){
		if(err){
			console.log(err)
		}else{
			res.send(rows)
		}
	})
})
//替换数据
router.post("/updatelist",function(req,res){
	res.header("Access-Control-Allow-Origin","*")
	var title=req.body["title"]
	var content=req.body["content"]
	var id=req.body['id']
	console.log(id)
	pool.query(`UPDATE news SET title='${title}',content='${content}' where id='${id}'`,function(err,rows,f){
		if(err){
			console.log(err)
		}else{
			res.send(rows)
		}
	})
})
//替换详情
router.post("/updatedetail",function(req,res){
	res.header("Access-Control-Allow-Origin","*")
	var cons=req.body["cons"].replace(/W3School/g, "&")
	var id=req.body['id']
	console.log(id)
	pool.query(`UPDATE newsdetail SET cons='${cons}' where id='${id}'`,function(err,rows,f){
		if(err){
			console.log(err)
		}else{
			res.send(rows)
		}
	})
})
//数据表添加数据
router.post("/addliebiao",function(req,res){
	res.header("Access-Control-Allow-Origin","*")
	var title=req.body["title"]
	var date=req.body["date"]
	console.log(title)
	pool.query(`insert into news(date,title) values('${date}','${title}')`,function(err,rows,fields){
		pool.query('select max(id) from news',function(e,r,f){
			res.send(r)

		})
	})
})



//数据表添加数据
router.post("/news",function(req,res){
	res.header("Access-Control-Allow-Origin","*")
	var imgs=req.body["imgs"]
	console.log(imgs)
	pool.query(`insert into newsimg(img) values('${imgs}')`,function(err,rows,fields){
		res.send("1")
	})
})
router.post("/cons",function(req,res){
	res.header("Access-Control-Allow-Origin","*")
	var cons=req.body["cons"].replace(/W3School/g, "&")
	var id=req.body["id"]
	var str=""
	console.log(req.body)
	for(var i in req.body){
		str+=(i+req.body[i])

	}
	console.log(str)
	pool.query(`insert into newsdetail(cons,id) values('${cons}','${id}')`,function(err,rows,fields){
		res.send("1")
	})
})
//单纯获取数据
const getData = (url,table) => {
	router.get(url,function(req,res){
		res.header("Access-Control-Allow-Origin", "*")
		pool.query(`SELECT * from ${table}`, function(err, rows, fields) {
	  	if (err) throw err;
	 	res.send(rows)
		});
	});
}
//服务器添加图片
router.post('/addimg',function(req,res){
	//跨域 打开接口
	res.header("Access-Control-Allow-Origin", "*");
	//创建进来的形式 核心对象
	var form = new formidable.IncomingForm();
	var path=[]
	//声明图片存放位置
	form.uploadDir='public/images/';
	//解析图片数据
	form.parse(req,function(error,fields,files){
		console.log(error)
 		//files 等同于前端传递过来的图片信息 是一个对象
		for(var i in files){
			var file = files[i];
			var fName = new Date().getTime()
			switch(file.type){    //检测图片的格式
				case "image/jpeg":
				fName=fName+".jpg";
				break;
				case "image/png":
				fName=fName+".png";
				break;
				case "image/gif":
				fName=fName+".gif";
				break;
				case "image/bmp":
				fName=fName+".bmp";
				break;
			}
			//创建图片路径名
			var newPath='public/images/'+fName;
			//新旧路径名替换
			fs.renameSync(file.path,newPath);
			//将一条或多条图片路径返回给前端
			path.push({"path":'images/'+fName})
		}
		//发送
		res.send(path);

	})
});

//获取news页图片
getData('/news','news')







module.exports=router;
