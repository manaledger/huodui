function GetRequest() { 
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
		theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
		} 
	} 
	return theRequest; 
} 


function donationBranch (){
	var request = GetRequest();
	$.post('/myDonation/mydonation_dataBranch',request,function(data,status){
		if(status != 'success') {
			alert('数据请求失败！');
			return;
		}
		if(data.code==0){
			alert(data.message);
			return;
		}
		var projectdata = data.data.projectdata;
		var personData 	= data.data.personData;
		var paymentdata = data.data.paymentdata;
		MydonationMoney(personData);
		
		switch (projectdata.verified){
			case 'draft':{
				$('#Textstatus').html('草稿');
				UndoingFunction(projectdata);
			}
				break;
			case 'wait':{
				$('#Textstatus').html('审核中');
				UndoingFunction(projectdata);
			}
				break;
			case 'refuse':{
				$('#Textstatus').html('不通过');
				UndoingFunction(projectdata);
			}
				break;
			case 'modify':{
				$('#Textstatus').html('退回修改');
				UndoingFunction(projectdata);
			}
				break;
			case 'pass':{
				$('#Textstatus').html('筹款中');
				UndoingFunction(projectdata);
			}
				break;
			case 'execute':{
				$('#Textstatus').html('已筹满');
				UndoingFunction(projectdata);
			}
				break;
			case 'execute':{
				$('#Textstatus').html('已过期');
				UndoingFunction(projectdata);
			}
				break;
			case 'over':{
				$('#Textstatus').html('已结束');
				hasBeenDoingFunction(projectdata,paymentdata);
			}
				break;
			case 'doing':{
				$('#Textstatus').html('执行中');
				hasBeenDoingFunction(projectdata,paymentdata);
			}
				break;
			default:{
				$('#Textstatus').html('项目状态未知');
			}
			break;
		}
		
	});
}
function MydonationMoney(personData){
	if(personData.length==0){
		$('#myskyblue-Bg').html('0');
		$('#mytimeid').html(moment().format('YYYY-MM-DD HH:MM'));
	}else{
		var money = 0.00;
		var timeStr = '';
		var i = 0;
		for (i in personData) {
			money += parseFloat(personData[i].donate_fee);
		}
		timeStr += moment(personData[0]['date']).format('YYYY-MM-DD HH:MM')
		if( i > 1){
			timeStr +='<br/>'+ '至'+'<br/>'+ moment(personData[i-1]['date']).format('YYYY-MM-DD HH:MM');
		}
		
		$('#myskyblue-Bg').html(money.toString());
		$('#mytimeid').html(timeStr);
		
	}
}

function UndoingFunction(projectdata){
	var realAmount = projectdata.realAmount;
	var objli = document.createElement('li');
	$('#middleContentStyle ul').append(objli);
	var spanObj = document.createElement('span');
	$(spanObj).html(realAmount).addClass('skyblue-Bg');
	objli.appendChild(spanObj);
	var imgObj = document.createElement('img');
	$(imgObj).attr('src','/Imges/ellipsisChain.png').addClass('chainImg');
	objli.appendChild(imgObj);
}

function hasBeenDoingFunction(projectdata,paymentdata){
	var realAmount = projectdata.realAmount;
	
	if(paymentdata.length==0){
		UndoingFunction(projectdata);
		return;
	}
	
	for (var i = 0; i < paymentdata.length; i++) {
		var liObj = document.createElement('li');
		var spanObj = document.createElement('span');
		var aObj = document.createElement('a');
		var divObj = document.createElement('div');
		var arrowObj = document.createElement('img');
		var rhombusObj = document.createElement('img');
		var chainObj = document.createElement('img');
		$('#middleContentStyle ul').append(liObj);
		liObj.appendChild(spanObj);
		liObj.appendChild(aObj);
		liObj.appendChild(divObj);
		liObj.appendChild(arrowObj);
		liObj.appendChild(rhombusObj);
		liObj.appendChild(chainObj);
		
		$(chainObj).addClass('chainImg');
		$(spanObj).addClass('skyblue-Bg');
		
		if(i%2==0){
			$(aObj).addClass('a-NoneStyle deepblue-Bg right-branchPosition-deepblue-Bg');
			$(divObj).addClass('lightblue-Bg left-time');
			$(arrowObj).addClass('righttArrowImg').attr('src','/Imges/rightBentArrow.png');
			$(rhombusObj).addClass('left-rhombus').attr('src','/Imges/rhombus.png');
		}else{
			$(aObj).addClass('a-NoneStyle deepblue-Bg left-branchPosition-deepblue-Bg');
			$(divObj).addClass('lightblue-Bg right-time');
			$(arrowObj).addClass('leftArrowImg').attr('src','/Imges/leftBentArrow.png');
			$(rhombusObj).addClass('right-rhombus').attr('src','/Imges/rhombus.png');
		}
		
		if(i==paymentdata.length-1){
			$(chainObj).attr('src','/Imges/ellipsisChain.png');
		}else{
			$(chainObj).attr('src','/Imges/middleChain.png');
		}
		
		
		var payMoney = paymentdata[i].payMoney / 100.0;
		var dateTime = moment(paymentdata[i].date).format('YYYY-MM-DD HH:MM');
		$(spanObj).html(realAmount);
		$(aObj).html(payMoney);
		$(divObj).html(dateTime);
		
		
		realAmount  = realAmount - payMoney;
		
	}
	
}



//参与的历史记录
function donationHistory(){
	var request = GetRequest();
	$.post('/myDonation/mydonation_history',request,function(data,status){
		if (status != 'success'){
			alert('数据请求失败');
			return;
		}
		if(data.code==0){
			alert(data.message);
			return;
		}
		
		alert(JSON.stringify(data));
		
		
		
	});
}
